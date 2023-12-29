import { ctpClient } from "@/libs/buildClient";
import NotificationContext, { NotifyMessage } from "@/libs/notificationContext";
import AdyenCheckout from "@adyen/adyen-web";
import {
  Cart,
  ClientResponse,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";
import { getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useContext, useEffect, useRef, useState } from "react";
import "@adyen/adyen-web/dist/adyen.css";

const CartPage = (): JSX.Element => {
  const dropInRef = useRef<HTMLDivElement>(null);
  const [cart, setCart] = useState<Cart>();
  const { setNotification }: NotifyMessage =
    useContext<NotifyMessage>(NotificationContext);

  useEffect(() => {
    (async () => {
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

      setCookie("cardVersion", cart.body.version);

      //initial checkout
      const paymentResponse = await fetch("/api/commerce/initialPayment");
      const data = await paymentResponse.json();

      const configuration = {
        environment: process.env.NEXT_PUBLIC_Adyen_Environment, // Change to 'live' for the live environment.
        clientKey: process.env.NEXT_PUBLIC_Adyen_ClientKey, // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
        analytics: {
          enabled: true, // Set to false to not send analytics data to Adyen.
        },
        session: data,
        onPaymentCompleted: async (result: any) => {
          console.info(result);

          //router.push(`/confirmation?orderid=${cardId}`);
        },
        onError: (error: any, component: any) => {
          console.error(error.name, error.message, error.stack, component);
        },
        // Any payment method specific configuration. Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
        // For example, this is 3D Secure configuration for cards:
        paymentMethodsConfiguration: {
          card: {
            hasHolderName: true,
            holderNameRequired: true,
            billingAddressRequired: true,
          },
        },
      };

      AdyenCheckout(configuration).then((res) => {
        res.create("dropin").mount(dropInRef.current!);
      });
    })();
  }, []);

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
          <div className="flex flex-row gap-4">
            <div className="bottom-0 left-0 h-48 items-end bg-gradient-to-t from-white via-white lg:h-auto lg:w-auto flex-grow p-5 rounded">
              {cart && (
                <div>
                  <div className="border-b-2 border-gray-300 border-solid py-5 flex font-bold">
                    <div className="flex-grow">Product</div>
                    <div className="relative basis-64"></div>
                    <div className="basis-24">Subtotal</div>
                  </div>
                  {cart.lineItems.map((item) => {
                    const defaultPrice =
                      item.variant!.prices![0].value.centAmount!;
                    const linePrice = item.price.value.centAmount;
                    return (
                      <div
                        key={item.id}
                        className="border-b-2 border-gray-300 border-solid py-5 flex flex-auto"
                      >
                        <div className="flex-grow">
                          <a href={`/products/${item.productSlug!["en-US"]}`}>
                            {item.name["en-US"]}
                          </a>
                        </div>

                        <div className="relative basis-64">
                          {defaultPrice != linePrice && (
                            <span className="text-sm line-through absolute -top-4">
                              ${defaultPrice / 100}
                            </span>
                          )}
                          ${linePrice / 100} x {item.quantity}
                        </div>

                        <div className="basis-24">
                          ${item.totalPrice.centAmount / 100}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="w-96">
              <div ref={dropInRef}></div>
            </div>
          </div>
        </div>

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left"></div>
      </main>
    </>
  );
};

export default CartPage;
