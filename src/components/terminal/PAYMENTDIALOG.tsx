import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/db";
import { OrderStatus } from "@/db/index.type";
import { usePaymentMethods } from "@/hooks/db_query";
import { numberFormatter } from "@/lib/utils";
import { getOrderStoreSnapShot, useOrderStore } from "@/stores/order.store";
import toast from "react-hot-toast";

export interface PAYMENTDIALOG {
  handleKitchenPrint: () => void;
}
export function PAYMENTDIALOG(props: PAYMENTDIALOG) {
  const { handleKitchenPrint } = props;
  const [paymentMethods] = usePaymentMethods();
  const { payment, setOrderStore, grandTotal, order_progress, resetState } =
    useOrderStore((state) => ({
      payment: state.payment_option,
      setOrderStore: state.setOrderStore,
      grandTotal: state.amount,
      order_progress: state.order_progress,
      resetState: state.resetState,
    }));

  const setPayment = (payment: string) =>
    setOrderStore({ payment_option: payment });

  const handlePayment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (grandTotal == 0) {
      toast.error("Please Select Items First!");
      return;
    }
    if (order_progress !== 100) {
      e.stopPropagation();
      toast.error("Order is still in Progress");
      return;
    }
    if (!payment) {
      e.stopPropagation();
      toast.error("Please select a Payment method");
      return;
    }
    let updatedOrderData = getOrderStoreSnapShot();
    updatedOrderData.status = OrderStatus.SUCCESS;
    await db.put(updatedOrderData);
    toast.success("Order Completed!");
    resetState();
    handleKitchenPrint();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold" variant="ghost">
          <i className="fa-brands fa-cc-visa text-cyan-500 text-lg mr-1"></i>
          Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[600px] max-w-none">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <div className="flex flex-row items-center gap-4"></div>
        </DialogHeader>
        <div className="h-[70px] w-full rounded-md border border-gray-300 flex justify-center items-center text-2xl">
          {numberFormatter.format(grandTotal)}
        </div>
        <div className="my-3 grid grid-cols-4 gap-3 items-start">
          {paymentMethods?.map((item) => (
            <Button
              variant={item._id == payment ? "destructive" : "default"}
              onClick={() => setPayment(item._id)}
              size={"lg"}
              key={item._id}
            >
              {item.name}
            </Button>
          ))}
        </div>
        <DialogClose asChild>
          <Button
            onClick={handlePayment}
            size={"lg"}
            className="my-3 bg-green-500 hover:bg-green-700"
          >
            Pay
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
