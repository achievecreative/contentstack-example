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
  url: string;
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

export type Header = Content & {
  logo: Image;
  notification_bar: {
    show_announcement: boolean;
    announcement_text: {};
  };
  navigation_menu: (PageComponent & {
    label: string;
    page_reference: (PageComponent & { url: string })[];
  })[];
};

export type ProductPage = Content & {
  seo: Seo;
  url: string;
  title: string;
  product_banner: {
    banner_image: Image;
  };
  product_features: { feature: { title: string; feature: string } }[];
  product_introducation: {
    type: string;
  };
  product: { data: Product[] };
};

export type Product = {
  createdAt: Date;
  description: ProductText;
  id: string;
  key: string;
  name: ProductText;
  slug: ProductText;
  masterVariant: {
    sku: string;
    prices: ProductPrice[];
    availability: {
      isOnStock: boolean;
      availableQuantity: number;
      id: string;
    };
  };
};

export type ProductPrice = {
  country: string;
  id: string;
  value: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
};

export type ProductText = {
  [key in "en-GB" | "de-DE" | "en-US"]: string;
};