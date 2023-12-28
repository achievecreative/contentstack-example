import NotificationContext from "@/libs/notificationContext";
import { useContext } from "react";

const Notification = (): JSX.Element => {
  const notification = useContext(NotificationContext);
  return (
    <>
      {notification?.display && (
        <div className="rounded-md bg-green-50 p-4 max-w-2xl mx-auto mt-5">
          <div className="flex">
            <div className="ml-3">
              <div className="mt-2 text-sm text-green-700">
                <p>{notification.message}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    className="ml-3 rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
