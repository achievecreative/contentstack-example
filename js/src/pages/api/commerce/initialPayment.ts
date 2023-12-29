import { ctpClient } from "@/libs/buildClient";
import { CheckoutAPI, Client } from "@adyen/api-library";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new Client({
    apiKey: process.env.Adyen_ApiKey!,
    environment: "TEST",
  });
  const checkout = new CheckoutAPI(client);

  const cartResponse = await createApiBuilderFromCtpClient(ctpClient)
    .withProjectKey({
      projectKey: process.env.NEXT_PUBLIC_COMMERCETOOLS_PROJECTKEY!,
    })
    .carts()
    .withId({ ID: req.cookies["cartId"]! })
    .get()
    .execute();

  const cart = cartResponse.body;

  const orderId = cart?.id;
  const amount = cart?.totalPrice.centAmount;

  const session = await checkout.PaymentsApi.sessions({
    amount: { currency: "USD", value: amount },
    reference: orderId,
    returnUrl: `${process.env.PUBLIC_URL}/api/commerce/callback?reference=${orderId}`,
    merchantAccount: process.env.Adyen_MerchantName!,
    allowedPaymentMethods: ["scheme"],
    countryCode: "AU",
  });
  res.status(200).json(session);
};

export default handler;
