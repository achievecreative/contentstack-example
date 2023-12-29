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

  console.log("🚀", props);

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

        <div className="relative place-items-center before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
          <h1 className="text-2xl font-bold">Thank you</h1>
          <p>Order Id: {order?.id}</p>
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
        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left"></div>
      </main>
    </>
  );
};

export default ConfirmationPage;
