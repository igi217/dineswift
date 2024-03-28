import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOrderStore } from "@/stores/order.store";
import React from "react";

export function NOTEDIALOG() {
  const { setOrderStore, ...notes } = useOrderStore((state) => ({
    kitchen_note: state.kitchen_note,
    staff_note: state.staff_note,
    payment_note: state.payment_note,
    setOrderStore: state.setOrderStore,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.target.name as keyof typeof notes;

    const value = e.target.value;

    setOrderStore({ [name]: value });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold" variant="ghost">
          <i className="fa-solid fa-file-lines text-red-500 text-lg mr-1"></i>
          Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[600px] max-w-none">
        <DialogHeader>
          <DialogTitle>Notes</DialogTitle>
          <div className="flex flex-row items-center gap-4">
            <div className="">
              <Label>Kitchen Note</Label>
              <Textarea
                className="h-[200px]"
                name="kitchen_note"
                placeholder="Kitchen Note..."
                value={notes.kitchen_note}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label>Staff Note</Label>
              <Textarea
                className="h-[200px]"
                name="staff_note"
                placeholder="Staff Note..."
                value={notes.staff_note}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label>Payment Note</Label>
              <Textarea
                className="h-[200px]"
                name="payment_note"
                placeholder="Payment Note..."
                value={notes.payment_note}
                onChange={handleChange}
              />
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
