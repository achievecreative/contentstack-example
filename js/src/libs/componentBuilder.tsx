import HeroBanner from "@/components/HeroBanner/HeroBanner";
import {
  HeroBannerProps,
  isHeroBannerProps,
} from "@/components/HeroBanner/HeroBanner.types";
import ProductList from "@/components/ProductList/ProductList";
import {
  ProductListProps,
  isProductListProps,
} from "@/components/ProductList/ProductList.type";
import Section from "@/components/Section/Section";
import {
  SectionProps,
  isSectionProps,
} from "@/components/Section/Section.type";
import { PageComponent } from "@/types/ContentTypes";
import React from "react";

export const renderPageComponent = <T extends Record<string, PageComponent>>(
  component: T
): JSX.Element | JSX.Element[] | undefined => {
  if (!component) {
    return <React.Fragment key={component}></React.Fragment>;
  }
  const keys = Object.keys(component);
  return keys.map((componentUid) => {
    if (isSectionProps(component[componentUid])) {
      return (
        <Section
          key={component[componentUid]._metadata.uid}
          {...(component[componentUid] as unknown as SectionProps)}
        />
      );
    }

    if (isHeroBannerProps(component[componentUid])) {
      return (
        <HeroBanner
          key={componentUid}
          {...(component[componentUid] as unknown as HeroBannerProps)}
        />
      );
    }

    if (isProductListProps(component[componentUid])) {
      return (
        <ProductList
          key={componentUid}
          {...(component[componentUid] as unknown as ProductListProps)}
        />
      );
    }

    switch (componentUid) {
      default:
        if (process.env.NODE_ENV == "development") {
          return <p key={componentUid}>Not Implemented - {componentUid}</p>;
        }
        return <React.Fragment key={componentUid}></React.Fragment>;
    }
  });
};
