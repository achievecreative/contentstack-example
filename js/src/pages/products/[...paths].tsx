import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import Head from "next/head";
import stack from "@/libs/stack";
import { ProductPage as ProductPageEntity } from "@/types/ContentTypes";
import { renderPageComponent } from "@/libs/componentBuilder";
import { v4 } from "uuid";
import React from "react";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
  const productPage: ProductPageEntity = await stack
    .ContentType("product_page")
    .Query()
    .equalTo("url", context.req.url!)
    .toJSON()
    .findOne();

  return {
    props: productPage,
  };
};

export default function ProductPage(props: ProductPageEntity) {
  const product =
    props.product?.data?.length > 0 ? props.product.data[0] : null;

  const addToCart = (sku: string | undefined) => {};
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
            <div>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => addToCart(product?.masterVariant.sku)}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left"></div>
      </main>
    </>
  );
}
