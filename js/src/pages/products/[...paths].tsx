import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import Head from "next/head";
import stack from "@/libs/stack";
import { ProductPage as ProductPageEntity } from "@/types/ContentTypes";
import React, { useContext, useRef } from "react";
import { getCookie, setCookie } from "cookies-next";
import { ctpClient } from "@/libs/buildClient";
import {
  createApiBuilderFromCtpClient,
  ApiRoot,
  Price,
} from "@commercetools/platform-sdk";
import NotificationContext, { NotifyMessage } from "@/libs/notificationContext";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
  const productPage: ProductPageEntity = await stack
    .ContentType("product_page")
    .Query()
    .equalTo("url", context.req.url!)
    .toJSON()
    .findOne();

  const prices = await createApiBuilderFromCtpClient(ctpClient)
    .withProjectKey({
      projectKey: process.env.NEXT_PUBLIC_COMMERCETOOLS_PROJECTKEY!,
    })
    .products()
    .withId({ ID: productPage.product.data[0].id })
    .get({ queryArgs: { priceCurrency: "USD" } })
    .execute();

  return {
    props: {
      ...productPage,
      prices: prices.body.masterData.current.masterVariant.prices,
    },
  };
};

export default function ProductPage(
  props: ProductPageEntity & { prices: Price[] }
) {
  const quantityRef = useRef<HTMLInputElement>(null);
  const { setNotification }: NotifyMessage =
    useContext<NotifyMessage>(NotificationContext);

  const product =
    props.product?.data?.length > 0 ? props.product.data[0] : null;

  const addToCart = async (productId: string | undefined) => {
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.NEXT_PUBLIC_COMMERCETOOLS_PROJECTKEY!,
    });

    let cartId = getCookie("cartId");
    let cartVersion = getCookie("cardVersion");
    if (!cartId) {
      const cart = await apiRoot
        .carts()
        .post({ body: { currency: "USD", country: "US" } })
        .execute();
      cartId = cart.body.id;
      setCookie("cartId", cartId);
      cartVersion = cart.body.version.toString();
    }

    const updatedCart = await apiRoot
      .carts()
      .withId({ ID: cartId as string })
      .post({
        body: {
          version: +cartVersion!,
          actions: [
            {
              action: "addLineItem",
              productId: productId,
              quantity: +quantityRef.current?.value!,
              variantId: 1,
            },
          ],
        },
      })
      .execute();

    cartVersion = updatedCart.body.version.toString();
    setCookie("cardVersion", cartVersion);

    if (setNotification) {
      setNotification({
        type: "Info",
        message: "Product is added",
        display: true,
      });
    }
  };
  return (
    <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.seo.meta_description} />
      </Head>
      <main
        className={`relative max-w-7xl mx-auto px-4 focus:outline-none sm:px-3 md:px-5 p-10`}
      >
        <div className="text-sm flex gap-2">
          <div className=" bottom-0 left-0 h-48 items-end bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
            {props.product_banner?.banner_image && (
              <img src={props.product_banner.banner_image.url} />
            )}
          </div>
          <div className=" h-auto p-5 flex flex-col gap-5">
            <h1 className="text-4xl">{product?.name["en-GB"]}</h1>
            <div>{product?.masterVariant.sku}</div>
            <div>
              $
              {product?.masterVariant.prices[0].value.centAmount &&
                product.masterVariant.prices[0].value.centAmount / 100}
            </div>
            <div className="flex flex-col gap-3">
              <div className="gap-2">
                Qty:
                <input
                  type="number"
                  defaultValue={1}
                  className="rounded-md py-2 pl-3 leading-6 text-sm ring-1 ml-2"
                  ref={quantityRef}
                />
              </div>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
                onClick={() => addToCart(product?.id)}
              >
                Add to cart
              </button>
            </div>
            {props.prices?.length > 0 && (
              <div className="text-md leading-6">
                <h2 className="text-md font-bold">Promotion</h2>
                {props.prices
                  .find((p) => !p.country)
                  ?.tiers?.map((priceTier) => {
                    return (
                      <div key={priceTier.minimumQuantity}>
                        <p>
                          ${priceTier.value.centAmount / 100} when you buy{" "}
                          {priceTier.minimumQuantity} and more.
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left"></div>
      </main>
    </>
  );
}
