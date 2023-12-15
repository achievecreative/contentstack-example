export type Content = {
  uid: string;
  _version: number;
  locale: string;
  _in_progress: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  publish_details: {
    time: string;
    user: string;
    environment: string;
    local: string;
  };

  tags: string[];
};

export type Page = Content & {
  seo: Seo;
  title: string;
  page_components?: Record<string, PageComponent>[];
  call_to_action: Link;
  image: Image;
};

export type Seo = {
  meta_title: string;
  meta_description: string;
  keywords: string;
  enable_search_index: boolean;
};

export type PageComponent = {
  _metadata: {
    uid: string;
  };
};

export type Link = {
  title: string;
  href: string;
};

export type Image = Content & {
  title: string;
  url: string;
  image_alignment: boolean;
};