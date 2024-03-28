import { Order, OrderProduct, OrderStatus } from "@/db/index.type";
import { cn } from "@/lib/utils";
import { ListView } from "../utility/ListView";
import { Button } from "../ui/button";
import { db } from "@/db";
import { NOTIFICATIONCENTER } from "@/functions/NotificationCenter";

export interface MenuCard {
  order: Order;
}
const COLORMAP = {
  [OrderStatus.CANCELED]: "bg-red-500",
  [OrderStatus.COOKING]: "bg-green-500",
  [OrderStatus.PENDING]: "bg-orange-500",
  [OrderStatus.SUCCESS]: "bg-green-500",
};
export interface MenuItem {
  item: OrderProduct;
  shouldShowCheck: boolean;
  handleItemComplete: (index: number) => Promise<void>;
  index: number;
}
export const MenuItem = (props: MenuItem) => {
  const { item, shouldShowCheck, handleItemComplete, index } = props;

  return (
    <div className="border-b border-slate-300 p-3">
      <div className="flex flex-row items-center font-bold">
        <div>{item.product.name}</div>

        <span className="ml-auto">{item.count}</span>
        {shouldShowCheck && (
          <input
            type="checkbox"
            className="ml-1"
            onChange={() => handleItemComplete(index)}
            checked={item.completed === true}
          />
        )}
      </div>
      <div className="mt-2">
        <div>
          Modifiers:{" "}
          {item.modifier.length
            ? item.modifier.map((item) => item.name).join(" ")
            : "None"}
        </div>
        <div>
          Remove Instruction:{" "}
          {item.modifier.length
            ? item.remove_instruction.map((item) => item.name).join(" ")
            : "None"}
        </div>
      </div>
    </div>
  );
};
export const MenuCard = (props: MenuCard) => {
  const { order } = props;

  const handleStartCooking = async () => {
    let updatedOrder: Order = { ...order, status: OrderStatus.COOKING };

    await db.put(updatedOrder);
  };

  const calculatePercent = (items: OrderProduct[]) => {
    return (items.filter((item) => item.completed).length / items.length) * 100;
  };
  const handleItemComplete = async (index: number) => {
    if (order.order_items[index].completed) {
      order.order_items[index].completed = false;
      order.order_progress = calculatePercent(order.order_items);
    } else {
      order.order_items[index].completed = true;
      order.order_progress = calculatePercent(order.order_items);
    }

    if (order.order_progress == 100) {
      await NOTIFICATIONCENTER.AddTerminalDisplayNotification(
        `#${order._id} is Ready to Serve`,
        order.order_type
      );
    }
    await db.put(order);
  };

  const showStartButton = order.status === OrderStatus.PENDING;

  return (
    <div className="bg-white shadow-sm">
      <div className={cn("w-full p-3", COLORMAP[order.status])}>
        <h6 className="text-white text-lg">#{order._id}</h6>
        <h6 className="text-white font-bold">
          {new Date(order.modified).toLocaleString()}
        </h6>
      </div>
      <ListView
        data={order.order_items}
        render={({ item, index }) => (
          <MenuItem
            handleItemComplete={handleItemComplete}
            shouldShowCheck={!showStartButton}
            item={item}
            index={index}
          />
        )}
      />
      {showStartButton && (
        <div className="flex p-3 justify-center items-center">
          <Button
            onClick={handleStartCooking}
            className="bg-green-500 hover:bg-green-700"
          >
            Start Cooking
          </Button>
        </div>
      )}
    </div>
  );
};
