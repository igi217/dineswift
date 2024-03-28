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
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multiselect";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { DBCollections } from "@/db/index.type";
import { useCustomer, useTableList } from "@/hooks/db_query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  customer_id: z.string().min(1, { message: "You must select a customer" }),
  modified: z.number(),
  customer_name: z.string(),
  datetime: z.number().min(1, { message: "You must select a date" }),
  tables: z
    .array(z.string())
    .nonempty({ message: "You must select atleast one table" }),
  guest: z.string().transform((value) => +value),
  notes: z.string(),
  status: z.number({ invalid_type_error: "Please Select a Status" }),
});
export default function BookingAdd() {
  const navigate = useNavigate();
  const [tables] = useTableList();
  const [customers] = useCustomer();
  const defaultValues = {
    customer_id: "",
    modified: Date.now(),
    customer_name: "",
    datetime: Date.now(),
    tables: [],
    guest: 1,
    notes: "",
    status: "" as any,
  };
  type Form = z.infer<typeof formSchema>;
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: Form) => {
    await db.post({
      table: DBCollections.BOOKING,
      ...values,
      customer_name: customers?.find((item) => item._id == values.customer_id)
        ?.name,
    });

    toast.success("Table(s) Reserved!");
  };
  const customerOptions =
    customers?.map((item) => ({
      value: item._id,
      label: `${item.name} (${item.phone})`,
    })) ?? [];

  const tableOptions =
    tables?.map((item) => ({
      label: `${item.name} Capacity: ${item.capacity}`,
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
                    name="tables"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Table</FormLabel>
                        <FormControl>
                          <MultiSelect
                            popoverClassName="w-[400px]"
                            value={field.value}
                            onChange={field.onChange}
                            options={tableOptions}
                            placeholder="Select Table"
                            searchPlaceholder="Search Table..."
                            notfoundText={"Couldn't find Table"}
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
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                          }}
                          value={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Pending</SelectItem>
                            <SelectItem value="1">Completed</SelectItem>
                            <SelectItem value="2">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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

BookingAdd.route = "/BookingAdd";
