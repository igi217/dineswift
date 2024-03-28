import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { db } from "@/db";
import { DBCollections } from "@/db/index.type";
import { useCustomer } from "@/hooks/db_query";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "./button";
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

export type CustomerDialog = {
  children?: React.ReactElement;
};

export default function CustomerDialog(props: CustomerDialog) {
  const [customers] = useCustomer();

  const [open, setOpen] = React.useState(false);

  const formSchema = z
    .object({
      modified: z.number(),
      name: z.string().min(1, { message: "You must enter Name" }),
      email: z.string(),
      phone: z.string().min(1, { message: "You must enter Phone Number" }),
      pincode: z.string(),
      address: z.string(),
    })
    .refine(
      (schema) => customers?.every((item) => item.email !== schema.email),
      {
        message: "Email Address already exists!",
        path: ["email"],
      }
    )
    .refine(
      (schema) => customers?.every((item) => item.phone !== schema.phone),
      {
        message: "Phone Number already exists!",
        path: ["phone"],
      }
    );

  const defaultValues = {
    name: "",
    modified: Date.now(),
    email: "",
    phone: "",
    pincode: "",
    address: "",
  };

  type Form = z.infer<typeof formSchema>;
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: Form) => {
    await db.post({
      table: DBCollections.CUSTOMER,
      ...values,
    });

    toast.success("A new customer added!");
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Customer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="pincode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pin Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button className="mr-2 mt-3" type="submit">
              Create
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant={"ghost"}
              type="button"
              className="mt-3"
            >
              Cancel
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
