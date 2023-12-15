import { Image, Link, PageComponent } from "@/types/ContentTypes";

export type SectionProps = PageComponent & {
  title_h2: string;
  description: string;
  call_to_action: Link;
  image: Image;
};

export const isSectionProps = function (props: any): props is SectionProps {
  if (!props) {
    return false;
  }

  return (
    "title_h2" in props &&
    "description" in props &&
    "call_to_action" in props &&
    "image" in props
  );
};
