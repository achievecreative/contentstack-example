import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import Head from "next/head";
import stack from "@/libs/stack";
import { Page as PageEntity } from "@/types/ContentTypes";
import { renderPageComponent } from "@/libs/componentBuilder";
import { v4 } from "uuid";
import React from "react";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
  const entities: PageEntity[][] = await stack
    .ContentType("product_page")
    .Query()
    .equalTo("url", context.req.url!)
    .toJSON()
    .find();
  const home = entities[0][0];

  return {
    props: home,
  };
};

export default function ProductPage(props: PageEntity) {
  const pageComponents = props?.page_components?.map((component) => {
    if (!component) {
      return;
    }

    const result = renderPageComponent(component);
    if (!result) {
      return;
    }

    return {
      key: v4(),
      Component: result,
    };
  });

  return (
    <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.seo.meta_description} />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24`}
      >
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none"></div>
        </div>

        <div className="relative place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
          {pageComponents?.map((item) => {
            if (!item || !item.Component) {
              return;
            }
            return (
              <React.Fragment key={item.key}>{item.Component}</React.Fragment>
            );
          })}
        </div>
        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left"></div>
      </main>
    </>
  );
}
