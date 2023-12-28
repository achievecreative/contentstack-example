import { ctpClient } from "@/libs/buildClient";
import {
  Cart,
  ClientResponse,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";
import { getCookie } from "cookies-next";
import Head from "next/head";
import { useEffect, useState } from "react";

const CartPage = (): JSX.Element => {
  const [cart, setCart] = useState<Cart>();

  async function getCart() {
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.NEXT_PUBLIC_COMMERCETOOLS_PROJECTKEY!,
    });

    let cartId = getCookie("cartId");

    const cart = await apiRoot
      .carts()
      .withId({ ID: cartId as string })
      .get()
      .execute();

    console.log("🚀", cart);

    setCart(cart.body);
  }

  useEffect(() => {
    getCart();
  }, []);

  async function refreshCart() {
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.NEXT_PUBLIC_COMMERCETOOLS_PROJECTKEY!,
    });

    let cartId = getCookie("cartId");

    const cart = await apiRoot
      .carts()
      .withId({ ID: cartId as string })
      .post({
        body: {
          version: 39,
          actions: [
            {
              action: "recalculate",
            },
          ],
        },
      })
      .execute();

    setCart(cart.body);
  }

  return (
    <>
      <Head>
        <title>Cart</title>
      </Head>
      <main
        className={`relative max-w-7xl mx-auto px-4 focus:outline-none sm:px-3 md:px-5 p-10`}
      >
        <div className="text-md">
          <div className="text-4xl pb-10">Cart</div>
          <div className=" bottom-0 left-0 h-48 items-end bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
            {cart &&
              cart.lineItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="border-b-2 border-gray-300 border-solid py-2 flex flex-auto"
                  >
                    <div className="flex-grow">{item.name["en-US"]}</div>

                    <div className="flex-grow">
                      ${item.price.value.centAmount / 100} x {item.quantity}
                    </div>

                    <div className="flex-grow">
                      ${item.totalPrice.centAmount / 100}
                    </div>
                  </div>
                );
              })}
            <button onClick={() => refreshCart()}>Refresh Cart</button>
          </div>
        </div>

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left"></div>
      </main>
    </>
  );
};

export default CartPage;
