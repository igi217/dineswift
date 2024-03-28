import Sound from "@/assets/sound/notification.wav";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { CALL, Customer, DBCollections } from "@/db/index.type";
import { resolveRoute } from "@/lib/utils";
import Terminal from "@/screens/terminal";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
export class CALLCENTER {
  static useCallHandler: () => Promise<void>;
}

CALLCENTER.useCallHandler = async () => {
  const currentuserJson = localStorage.getItem("@current_user");
  const currenUser: any = JSON.parse(currentuserJson!);
  const customers = await db.find({
    selector: {
      table: DBCollections.CUSTOMER,
    },
  });
  db.changes({
    since: "now",
    live: true,
  }).on("change", async () => {
    let calls = await db.find({
      selector: {
        table: DBCollections.CALLS,
        user_id: currenUser._id,
      },
    });
    const call = calls.docs.at(-1) as CALL;

    if (call && call.phoneNumber) {
      let customer = (customers.docs as any)?.find(
        (item: Customer) => item.phone === call.phoneNumber
      );
      const audio = new Audio(Sound);
      audio.play();
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-[350px] w-full bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex flex-col`}
          >
            <div className="w-full p-4">
              <p className="font-bold text-white text-lg">
                {customer?.name ?? call.phoneNumber}
              </p>
              <p className="mt-2 text-white">
                {customer?.customer_type ?? "General"}
              </p>
              <div className="flex mt-4 flex-row items-center gap-2 justify-between">
                <Link
                  to={resolveRoute(Terminal.route, { order_type: "dine_in" })}
                >
                  <Button size={"sm"}>Dine-In</Button>
                </Link>
                <Link
                  to={resolveRoute(Terminal.route, { order_type: "take_away" })}
                >
                  <Button size={"sm"}>Take Away</Button>
                </Link>
                <Link
                  to={resolveRoute(Terminal.route, {
                    order_type: "collection",
                  })}
                >
                  <Button size={"sm"}>Collection</Button>
                </Link>
                <Link
                  to={resolveRoute(Terminal.route, { order_type: "delivery" })}
                >
                  <Button size={"sm"}>Delivery</Button>
                </Link>
              </div>
            </div>
          </div>
        ),
        { id: "callNotification" }
      );
    }

    let deleted = calls.docs.map((item) => ({ ...item, _deleted: true }));
    await db.bulkDocs(deleted);
  });
};
