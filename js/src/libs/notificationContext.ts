import { createContext, useState } from "react";

export type NotifyMessage = {
  type?: "Info" | "Warning";
  message?: string;
  display?: boolean;
  setNotification?: (notification: NotifyMessage) => void;
};

const NotificationContext = createContext<NotifyMessage>({});

export default NotificationContext;
