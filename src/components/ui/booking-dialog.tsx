import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/db";
import { DBCollections, Table } from "@/db/index.type";
import { useCustomer } from "@/hooks/db_query";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "./button";
import { Combobox } from "./combobox";
import CustomerDialog from "./customer-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";

export type BookingDialog = {
  tables: Table[];
  children?: React.ReactElement;
};

export default function BookingDialog(props: BookingDialog) {
  const [customers] = useCustomer();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");

  const formSchema = z
    .object({
      customer_id: z.string().min(1, { message: "You must select a customer" }),
      modified: z.number(),
      customer_name: z.string(),
      datetime: z.number().min(1, { message: "You must select a date" }),
      tables: z.array(z.string()),
      guest: z.number().min(1, { message: "You must enter a number" }),
      notes: z.string(),
    })
    .refine(() => error == "", { message: error, path: ["datetime"] });

  const defaultValues = {
    customer_id: "",
    modified: Date.now(),
    customer_name: "",
    datetime: Date.now(),
    tables: [],
    guest: 1,
    notes: "",
  };
  type Form = z.infer<typeof formSchema>;
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const datetime = form.watch("datetime");

  const onSubmit = async (values: Form) => {
    if (error.length > 0) return;

    await db.post({
      table: DBCollections.BOOKING,
      ...values,
      customer_name: customers?.find((item) => item._id == values.customer_id)
        ?.name,
      tables: props.tables.map((item) => item._id),
      status: 0,
    });

    toast.success("Table(s) Reserved!");
    setOpen(false);
  };
  const options =
    customers?.map((item) => ({
      value: item._id,
      label: `${item.name} (${item.phone})`,
    })) ?? [];
  React.useEffect(() => {
    (async () => {
      let bookings = await db.find({
        selector: {
          table: DBCollections.BOOKING,
          status: 0,
          tables: {
            $elemMatch: {
              $in: props.tables.map((item) => item._id),
            },
          },
          datetime,
        },
      });

      if (bookings.docs.length > 0) {
        setError("Table(s) are already booked on same date and time");
      } else {
        setError("");
      }
    })();
  }, [props.tables, datetime]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve Table</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="customer_id"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Customer</FormLabel>
                  <FormControl>
                    <Combobox
                      popoverClassName="w-[400px]"
                      value={field.value}
                      onChange={field.onChange}
                      options={options}
                      placeholder="Select Customer"
                      searchPlaceholder="Search Customer..."
                      notfoundText={
                        <div>
                          Couldn't find customer{" "}
                          <CustomerDialog>
                            <Button type="button" variant={"link"}>
                              Create New
                            </Button>
                          </CustomerDialog>
                        </div>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="guest"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="datetime"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Datetime</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      onChange={(e) =>
                        field.onChange(new Date(e.target.value).getTime())
                      }
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="notes"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button className="mt-2">Add</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
