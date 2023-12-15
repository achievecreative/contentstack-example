import { Image, Link, PageComponent } from "@/types/ContentTypes";

export type SectionProps = PageComponent & {
  title_h2: string;
  description: string;
  call_to_action: Link;
  image: Image;
};
