import { ctpClient } from "@/libs/buildClient";
import NotificationContext from "@/libs/notificationContext";
import {
  Order,
  Product,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Head from "next/head";
import { useContext, useState } from "react";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<{ order?: Order; products: Product[] }>
> => {
  const { orderid } = context.query;

  const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey: process.env.NEXT_PUBLIC_COMMERCETOOLS_PROJECTKEY!,
  });

  const order = await apiRoot
    .orders()
    .withId({ ID: orderid as string })
    .get()
    .execute();

  const productIds = order.body.lineItems.map((line) => line.productId);

  const products = apiRoot
    .products()
    .get({ queryArgs: { where: productIds.map((id) => `id = \"${id}\"`) } })
    .execute();

  return {
    props: { order: order.body, products: (await products).body.results },
  };
};

const OrderDetailPage = (props: { order?: Order; products: Product[] }) => {
  const { order: originOrder, products } = props;
  const notifyContext = useContext(NotificationContext);

  const [order, setOrder] = useState(originOrder);

  console.log("🚀", props);

  const changeStatus = async () => {
    const response = await createApiBuilderFromCtpClient(ctpClient)
      .withProjectKey({
        projectKey: process.env.NEXT_PUBLIC_COMMERCETOOLS_PROJECTKEY!,
      })
      .orders()
      .withId({ ID: order?.id! })
      .post({
        body: {
          version: order?.version!,
          actions: [
            {
              action: "changeOrderState",
              orderState: "Complete",
            },
          ],
        },
      })
      .execute();

    setOrder(response.body);

    notifyContext?.setNotification!({
      display: true,
      message: "Done",
      type: "Info",
    });
  };

  return (
    <>
      <Head>
        <title>Thank you</title>
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 pt-4`}
      >
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none"></div>
        </div>

        <div className="relative flex flex-col gap-3 w-full">
          <h1 className="text-4xl font-bold">Thank you</h1>
          <p>Order Id: {order?.id}</p>
          <p>Status: {order?.orderState}</p>
          {order &&
            order.lineItems.map((line) => {
              const product = products.find((p) => p.id == line.productId);
              return (
                <div key={line.id}>
                  <div>
                    {product?.masterData.current.name["en-US"]} x{" "}
                    {line.quantity} = ${line.totalPrice.centAmount / 100}{" "}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left">
          <input
            type="button"
            value="Change status to Complete"
            className="bg-blue-500 rounded p-5 text-white hover:bg-blue-400 cursor-auto"
            onClick={() => changeStatus()}
          />
        </div>
      </main>
    </>
  );
};

export default OrderDetailPage;
