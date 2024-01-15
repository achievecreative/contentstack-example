import { Roboto } from "next/font/google";
import { ReactNode, useState } from "react";
import Header from "./components/Header/Header";
import NotificationContext, { NotifyMessage } from "./libs/notificationContext";
import Notification from "./components/Notification/Notification";

const inter = Roboto({ weight: ["100", "300", "400"], subsets: ["latin"] });

const Layout = ({
  children,
  header,
}: {
  children: ReactNode;
  header: any;
}): JSX.Element => {
  const [notification, setNotification] = useState<NotifyMessage>();

  const updateNotification = (notification: NotifyMessage) => {
    setNotification(notification);
  };
  return (
    <div className={inter.className}>
      <NotificationContext.Provider
        value={{ ...notification, setNotification: updateNotification }}
      >
        <Header {...header} />
        <Notification />
        {children}
      </NotificationContext.Provider>
    </div>
  );
};

export default Layout;
