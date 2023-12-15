import HeroBanner, { HeroBannerName } from "@/components/HeroBanner/HeroBanner";
import Section from "@/components/Section/Section";
import { SectionProps } from "@/components/Section/Section.type";
import { PageComponent } from "@/types/ContentTypes";
import React from "react";

export const renderPageComponent = <T extends Record<string, PageComponent>>(
  component: T
): JSX.Element | JSX.Element[] | undefined => {
  if (!component) {
    return <></>;
  }
  const keys = Object.keys(component);
  return keys.map((componentUid) => {
    switch (componentUid) {
      case "section":
        return (
          <Section
            key={component[componentUid]._metadata.uid}
            {...(component[componentUid] as unknown as SectionProps)}
          />
        );
      case HeroBannerName:
        return <HeroBanner {...component[componentUid]} />;
      default:
        if (process.env.NODE_ENV == "development") {
          return <p>Not Implemented - {componentUid}</p>;
        }
        return <></>;
    }
  });
};
