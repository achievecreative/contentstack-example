import { hmacValidator } from "@adyen/api-library";
import { Notification } from "@adyen/api-library/lib/src/typings/notification/notification";
import { NotificationRequestItem } from "@adyen/api-library/lib/src/typings/notification/notificationRequestItem";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const validator = new hmacValidator();
  const notificationRequest = req.body as Notification;

  notificationRequest?.notificationItems?.forEach(async (requestItem) => {
    // Handle the notification
    if (
      !process.env.Adyen_HMACKey ||
      validator.validateHMAC(
        requestItem.NotificationRequestItem,
        process.env.Adyen_HMACKey!
      )
    ) {
      // Process the notification based on the eventCode
      const eventCode = requestItem.NotificationRequestItem.eventCode;
      switch (eventCode) {
        case NotificationRequestItem.EventCodeEnum.Authorisation:
          const orderId = requestItem.NotificationRequestItem.merchantReference;
          await UpdatePaymentMethodInfo(orderId, {
            reference: requestItem.NotificationRequestItem.pspReference!,
            CardType: requestItem.NotificationRequestItem.paymentMethod!,
            PartialAccountNumber:
              requestItem.NotificationRequestItem.additionalData?.cardSummary!,
            CardholderName: `${requestItem.NotificationRequestItem.additionalData?.NAME1} ${requestItem.NotificationRequestItem.additionalData?.NAME2}`,
          });
          break;
      }
    } else {
      // Non valid NotificationRequest
      console.log("Non valid NotificationRequest");
    }
  });

  res.status(200).send("[accepted]");
}

async function UpdatePaymentMethodInfo(
  orderId: string,
  creditCard: {
    reference: string;
    CardType: string;
    PartialAccountNumber: string;
    CardholderName: string;
  }
) {
  console.log("Update order - " + orderId);
  return Promise.resolve();
}
