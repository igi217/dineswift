import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { db } from "@/db";
import { DBCollections } from "@/db/index.type";
import { useCategoryList } from "@/hooks/db_query";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

export default function CouponAdd() {
  const navigate = useNavigate();

  const [categories] = useCategoryList();

  const [couponError, setCouponError] = React.useState("");

  const formSchema = z
    .object({
      name: z.string().min(1, { message: "You must fill this field" }),
      categories: z.array(z.string()),
      percentage: z.string().transform((value) => +value),
      code: z.string(),
      modified: z.number(),
    })
    .refine(() => couponError == "", { message: couponError, path: ["code"] });

  const defaultValues = {
    name: "",
    categories: [],
    percentage: 0,
    modified: Date.now(),
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const code = form.watch("code");

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await db.post({
        table: DBCollections.COUPON,
        ...value,
      });

      toast.success("Coupon Created!");
    } catch (err: any) {
      console.error(err);
    }
  };

  const options =
    categories?.map((item) => ({
      value: item._id,
      label: item.name,
    })) ?? [];
  React.useEffect(() => {
    (async () => {
      let coupons = await db.find({
        selector: {
          table: DBCollections.COUPON,
          code,
        },
      });
      if (coupons.docs.length > 0) {
        setCouponError("Duplicate coupon code is not allowed");
        return;
      }
      setCouponError("");
    })();
  }, [code]);

  console.log(form.formState.errors)
  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Add Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentage</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="categories"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Categories</FormLabel>
                        <FormControl>
                          <MultiSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={options}
                            placeholder="Select Categories"
                            searchPlaceholder="Search Category..."
                            notfoundText={"Couldn't find Category"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <Button className="mt-3" type="submit">
                    Save
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate(-1)}
                    variant={"secondary"}
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

CouponAdd.route = "/CouponAdd";
