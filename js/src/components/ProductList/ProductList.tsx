import { ProductListProps } from "./ProductList.type";

const ProductList = (props: ProductListProps): JSX.Element => {
  console.log(props.products[0].product.data[0].masterVariant);
  return (
    <div>
      {props.products?.map((product, index) => {
        return (
          <div
            key={product.uid}
            className={
              "flex flex-row py-4 gap-4 p-5 " +
              (index % 2 == 1 ? " flex-row-reverse bg-white round m-5" : "")
            }
          >
            <div>
              <img
                src={product.product.data[0].masterVariant.images[0].url}
                className="max-w-sm rounded bg-transparent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold pb-4">
                <a href={product.url}>{product.title}</a>
              </h1>
              <p className="italic">
                start from $
                {product.product.data[0].masterVariant.prices[0].value
                  .centAmount / 100}
              </p>
              <p>{product.product.data[0].description["en-US"]}</p>
              <p className="pt-5">
                <a href={product.url} className="text-blue-700 underline">
                  Find out more
                </a>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
