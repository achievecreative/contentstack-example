import { ctpClient } from "@/libs/buildClient";
import {
  Order,
  Product,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Head from "next/head";

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

const ConfirmationPage = (props: { order?: Order; products: Product[] }) => {
  const { order, products } = props;

  return (
    <>
      <Head>
        <title>Thank you</title>
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24`}
      >
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none"></div>
        </div>

        <div className="relative w-full leading-6 flex flex-col gap-3">
          <h1 className="text-4xl font-bold py-5">Thank you</h1>
          <p className="leading-6">
            Order Id:{" "}
            <a
              href={`/orders/details/${order?.id}`}
              className="text-blue-700 underline cursor-pointer"
            >
              {order?.id}
            </a>
          </p>
          {order &&
            order.lineItems.map((line) => {
              const product = products.find((p) => p.id == line.productId);
              return (
                <div key={line.id} className="leading-6">
                  {product?.masterData.current.name["en-US"]} x{line.quantity} =
                  ${line.totalPrice.centAmount / 100}
                </div>
              );
            })}
        </div>
        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left"></div>
      </main>
    </>
  );
};

export default ConfirmationPage;
