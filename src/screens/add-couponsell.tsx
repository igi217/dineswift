import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import CustomerDialog from "@/components/ui/customer-dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { db } from "@/db";
import { DBCollections } from "@/db/index.type";
import { useCoupons, useCustomer } from "@/hooks/db_query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  customer_id: z.string().min(1, { message: "You must select a customer" }),
  modified: z.number(),
  coupon_id: z.string().min(1, { message: "You must select a Coupon" }),
});
export default function CouponSellAdd() {
  const navigate = useNavigate();
  const [coupons] = useCoupons();
  const [customers] = useCustomer();
  const defaultValues = {
    customer_id: "",
    modified: Date.now(),
    coupon_id: "",
  };
  type Form = z.infer<typeof formSchema>;
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: Form) => {
    await db.post({
      table: DBCollections.COUPON_SELL,
      ...values,
    });

    toast.success("Coupon Sell Added!");
  };
  const customerOptions =
    customers?.map((item) => ({
      value: item._id,
      label: `${item.name} (${item.phone})`,
    })) ?? [];
  const couponOptions =
    coupons?.map((item) => ({
      label: item.name,
      value: item._id,
    })) ?? [];

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Add Reservation</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    name="coupon_id"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Coupon</FormLabel>
                        <FormControl>
                          <Combobox
                            popoverClassName="w-[400px]"
                            value={field.value}
                            onChange={field.onChange}
                            options={couponOptions}
                            placeholder="Select Coupon"
                            searchPlaceholder="Search Coupon..."
                            notfoundText={<div>Couldn't find Coupon</div>}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
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
                            options={customerOptions}
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

                  <Button className="mt-2">Save</Button>
                  <Button
                    type="button"
                    variant={"secondary"}
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}

CouponSellAdd.route = "/CouponSellAdd";
