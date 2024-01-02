import { Image, Link, PageComponent } from "@/types/ContentTypes";

export type HeroBannerProps = PageComponent & {
  banner_image: Image;
  bg_color: string;
  banner_title: string;
  banner_description: string;
  call_to_action: Link;
};

export const isHeroBannerProps = (props: any): props is HeroBannerProps => {
  if (!props) {
    return false;
  }

  return (
    "banner_image" in props &&
    "bg_color" in props &&
    "banner_title" in props &&
    "banner_description" in props &&
    "call_to_action" in props
  );
};
