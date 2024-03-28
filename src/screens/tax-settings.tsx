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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { db } from "@/db";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const taxSchema = z.object({
  name: z.string(),
  percentage: z
    .number()
    .min(0.01, { message: "Must be a valid Tax Percentage" }),
});
const formSchema = z.object({
  modified: z.number(),
  total_tax: z.string().transform((value) => +value),
  taxes: z.array(taxSchema),
  _id: z.string(),
  _rev: z.string().optional(),
});
export default function TaxSettings() {
  const defaultValues = {
    total_tax: 0,
    modified: Date.now(),
    _id: "config/_tax",
    taxes: [
      {
        name: "Example TAX",
        percentage: 0,
      },
    ],
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "taxes",
  });

  const loadSettings = async () => {
    let setting = await db.get(defaultValues._id);

    form.reset(setting);
  };
  const taxes = form.watch("taxes");
  const total_tax = taxes.reduce(
    (previous, current) => previous + current.percentage,
    0
  );
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await db.put({ ...value, total_tax });
      loadSettings();
      toast.success("Settings Saved");
    } catch (err: any) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    loadSettings();
  }, []);
  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>TAX Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {fields.map((_item, index) => (
                    <div
                      key={index}
                      className="flex flex-row items-end justify-between gap-3"
                    >
                      <FormField
                        control={form.control}
                        name={`taxes.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Tax Name</FormLabel>
                            <FormControl>
                              <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`taxes.${index}.percentage`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Tax Percentage</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        disabled={fields.length <= 1}
                        onClick={() => remove(index)}
                        variant={"destructive"}
                      >
                        <i className="fa-solid fa-trash-alt"></i>
                      </Button>
                    </div>
                  ))}
                  <FormField
                    control={form.control}
                    name="total_tax"
                    render={() => (
                      <FormItem>
                        <FormLabel>Total TAX</FormLabel>
                        <FormControl>
                          <Input type="number" value={total_tax} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="mt-3 mr-1" type="submit">
                    Save
                  </Button>
                  <Button
                    className="mt-3"
                    onClick={() =>
                      append({
                        name: "Tax Name",
                        percentage: 0,
                      })
                    }
                    type="button"
                    variant="secondary"
                  >
                    Add More
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

TaxSettings.route = "/TaxSettings";
