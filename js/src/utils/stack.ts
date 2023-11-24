import { Region, Stack } from "contentstack";

const stack = new Stack({
  api_key: process.env.CONTENTSTACK_APIKEY!,
  delivery_token: process.env.CONTENTSTACK_DELIVERYTOKEN!,
  environment: process.env.CONTENTSTACK_ENVIRONMENT!,
  region: process.env.CONTENTSTACK_REGION! as Region,
});

export default stack;
