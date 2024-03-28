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
import { DBCollections, Product } from "@/db/index.type";
import { useCategoryList } from "@/hooks/db_query";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "You must fill this field" }),
  categories: z.array(z.string()),
  percentage: z.string().transform((value) => +value),
  modified: z.number(),
  _id: z.string(),
  _rev: z.string(),
});
export default function DiscountEdit() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [categories] = useCategoryList();

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

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await db.put({
        table: DBCollections.DISCOUNT,
        ...value,
      });
      let products = (await db.find({
        selector: {
          table: DBCollections.ITEM,
          category_id: {
            $in: value.categories,
          },
        },
      })) as PouchDB.Find.FindResponse<Product>;

      let updatedProducts = products.docs.map((item) => ({
        ...item,
        discount_name: value.name,
        discount_percentage: value.percentage,
      }));

      await db.bulkDocs(updatedProducts);

      toast.success("Discount Applied!");
      form.reset();
      navigate(-1);
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
      if (!id) return;

      let data = await db.get(id);

      form.reset(data);
    })();
  }, [id]);
  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Update Discount</CardTitle>
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
                    name="percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentage</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
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

DiscountEdit.route = "/DiscountEdit/:id";
