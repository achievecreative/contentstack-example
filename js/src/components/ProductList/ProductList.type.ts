import { Page, ProductPage } from "@/types/ContentTypes";

export type ProductListProps = {
  products: ProductPage[];
};

export const isProductListProps = (props: any): props is ProductListProps => {
  return "products" in props;
};
