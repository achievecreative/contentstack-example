import { Region, Stack } from "contentstack";

const stack = new Stack({
  api_key: process.env.CONTENTSTACK_APIKEY!,
  delivery_token: process.env.CONTENTSTACK_DELIVERYTOKEN!,
  environment: process.env.CONTENTSTACK_ENVIRONMENT!,
  region: process.env.CONTENTSTACK_REGION! as Region,
});

export const getHeader = async () => {
  const header = await stack
    .ContentType("header")
    .Query()
    .includeReference("navigation_menu.page_reference")
    .toJSON()
    .findOne();
  console.log(header);
  return header;
};

export default stack;
