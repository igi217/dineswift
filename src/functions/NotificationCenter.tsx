import { db } from "@/db";
import {
  DBCollections,
  NOTIFICATION,
  NOTIFICATIONCATEGORY,
  NOTIFICATIONSTATUS,
  OrderType,
} from "@/db/index.type";
import { useTerminalNotification } from "@/hooks/db_query";
import { resolveRoute } from "@/lib/utils";
import Terminal from "@/screens/terminal";
import React from "react";
import toast from "react-hot-toast";
import Sound from "@/assets/sound/notification.wav";
export class NOTIFICATIONCENTER {
  static AddTerminalDisplayNotification: (
    message: string,
    order_type: OrderType
  ) => Promise<void>;
  static useNotificationHandler: () => void;
}

NOTIFICATIONCENTER.AddTerminalDisplayNotification = async (
  message: string,
  order_type: OrderType
) => {
  let body: Partial<NOTIFICATION> = {
    title: "Notification",
    content: message,
    status: NOTIFICATIONSTATUS.PENDING,
    category: NOTIFICATIONCATEGORY.TERMINAL,
    link: resolveRoute(Terminal.route, { order_type }),
    table: DBCollections.NOTIFICATION,
  };

  await db.post(body);
};
NOTIFICATIONCENTER.useNotificationHandler = () => {
  const [notifications] = useTerminalNotification();

  React.useLayoutEffect(() => {
    (async () => {
      let notification = notifications?.[0];

      if (!notification) return;
      await db.remove(notification);

      const audio = new Audio(Sound);
      audio.play();

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-[220px] w-full bg-white shadow-lg rounded-lg pointer-events-auto flex`}
        >
          <div className="flex-1 w-0 p-4">
            <p className="font-bold text-gray-900">{notification!.title}</p>
            <p className="mt-1 text-sm text-gray-500">{notification!.content}</p>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
    })();
  }, [notifications?.length]);
};
