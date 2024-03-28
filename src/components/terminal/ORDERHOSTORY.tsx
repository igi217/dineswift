import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollBar } from "@/components/ui/scroll-area";
import { OrderType } from "@/db/index.type";
import { userOrderListByType } from "@/hooks/db_query";
import { handleOrderSelect } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useParams } from "react-router-dom";

export type Params = {
  order_type: OrderType;
};
export function ORDERHISTORY() {
  const { order_type } = useParams<Params>();
  const [orderHistory] = userOrderListByType(order_type!);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold" variant="ghost">
          <i className="fa-solid fa-rectangle-history text-violet-500 text-lg mr-1"></i>
          Previous Orders
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[800px] max-w-none">
        <DialogHeader>
          <DialogTitle>ORDERS</DialogTitle>
          <ScrollArea className="w-full h-full grid grid-cols-2 gap-6">
            {orderHistory?.map((item) => {
              return (
                <DialogClose key={item._id} asChild>
                  <div
                    className="p-2 border cursor-pointer text-violet-500 border-violet-500 rounded-sm bg-violet-100"
                    onClick={() => handleOrderSelect(item._id)}
                  >
                    <span className="block font-bold text-lg">#{item._id}</span>
                    <span className="font-semibold my-2 block text-sm">
                      Progress: {item.order_progress}%
                    </span>
                    <span className="font-semibold my-2 block text-sm">
                      Customer: {item.customer_name}
                    </span>
                  </div>
                </DialogClose>
              );
            })}
            <ScrollBar />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
