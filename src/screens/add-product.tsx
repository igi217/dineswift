import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GradientPicker } from "@/components/ui/gradient-picker";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multiselect";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { DBCollections } from "@/db/index.type";
import {
  useAllergenList,
  useCategoryList,
  useDepartmentList,
  useFilters,
  useModifierGroups,
} from "@/hooks/db_query";
import { uploadFile } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "You must fill this field" }),
  modified: z.number(),
  code: z.string().min(1, { message: "You must fill this field" }),
  description: z.string(),
  image: z.string(),
  discount_name: z.string(),
  discount_percentage: z.string().transform((value) => +value),
  category_id: z.string().min(1, { message: "You must select a Category" }),
  cost: z.string().transform((value) => +value),
  delivery_price: z.string().transform((value) => +value),
  collection_price: z.string().transform((value) => +value),
  take_away_price: z.string().transform((value) => +value),
  dine_in_price: z.string().transform((value) => +value),
  total_tax: z.string().transform((value) => +value),
  department_id: z.string().min(1, { message: "You must select a department" }),
  color: z.string(),
  backgroundColor: z.string(),
  modifier_group_id: z.string(),
  allergen: z.array(z.string()),
  filter: z.array(z.string()),
});
export default function ProductAdd() {
  const navigate = useNavigate();
  const [allergens] = useAllergenList();
  const [modifiergroups] = useModifierGroups();
  const [departments] = useDepartmentList();
  const [categories] = useCategoryList();
  const [filters] = useFilters();
  const [file, setFile] = React.useState<File | null>(null);

  const defaultValues = {
    name: "",
    modified: Date.now(),
    code: "",
    description: "",
    image: "",
    discount_name: "",
    discount_percentage: 0,
    category_id: "",
    cost: 0,
    delivery_price: 0,
    collection_price: 0,
    take_away_price: 0,
    dine_in_price: 0,
    total_tax: 0,
    department_id: "",
    color: "#FFF",
    backgroundColor: "#6366f1",
    modifier_group_id: "",
    allergen: [],
    filter: [],
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const category_id = form.watch("category_id");

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    if (file) {
      let filePath = await uploadFile(file);

      if (filePath !== false) {
        value = { ...value, image: filePath };
      }
    }
    try {
      await db.post({
        table: DBCollections.ITEM,
        ...value,
      });

      toast.success("Item Added");
    } catch (err: any) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    let category = categories?.find((item) => item._id == category_id);

    form.setValue("total_tax", category?.total_tax ?? 0);
  }, [category_id]);

  const deptOptions =
    departments?.map((item) => ({
      value: item._id,
      label: item.name,
    })) ?? [];
  const categoryOptions =
    categories?.map((item) => ({ label: item.name, value: item._id })) ?? [];

  const modifiergroupOptions =
    modifiergroups?.map((item) => ({ label: item.name, value: item._id })) ??
    [];

  const allergenOptions =
    allergens?.map((item) => ({
      label: item.name,
      value: item.name,
    })) ?? [];
  const filterOptions =
    filters?.map((item) => ({
      label: `${item.filter_attribute?.attribute} : ${item.value}`,
      value: item.value,
    })) ?? [];
  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Add Product</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PLU Code</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Combobox
                            value={field.value}
                            onChange={field.onChange}
                            options={categoryOptions}
                            placeholder="Select Category"
                            searchPlaceholder="Search Category..."
                            notfoundText={"Category Not found"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.length) {
                                setFile(e.target.files[0]);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Percentage</FormLabel>
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
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost</FormLabel>
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
                    control={form.control}
                    name="dine_in_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dine-In Price</FormLabel>
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
                    control={form.control}
                    name="delivery_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Price</FormLabel>
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
                    control={form.control}
                    name="collection_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection Price</FormLabel>
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
                    control={form.control}
                    name="take_away_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Takeaway Price</FormLabel>
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
                    control={form.control}
                    name="total_tax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Tax</FormLabel>
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
                    control={form.control}
                    name="department_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Combobox
                            value={field.value}
                            onChange={field.onChange}
                            options={deptOptions}
                            placeholder="Select Department"
                            searchPlaceholder="Search Department..."
                            notfoundText={"Department Not found"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="backgroundColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Color</FormLabel>
                        <FormControl>
                          <GradientPicker
                            background={field.value}
                            setBackground={field.onChange}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Foreground Color</FormLabel>
                        <FormControl>
                          <GradientPicker
                            background={field.value}
                            setBackground={field.onChange}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modifier_group_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modifier Group</FormLabel>
                        <FormControl>
                          <Combobox
                            value={field.value}
                            onChange={field.onChange}
                            options={modifiergroupOptions}
                            placeholder="Select Modifier group"
                            searchPlaceholder="Search Modifier Group..."
                            notfoundText={"Modifier Group Not found"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allergen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergens</FormLabel>
                        <FormControl>
                          <MultiSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={allergenOptions}
                            placeholder="Select Allergens"
                            searchPlaceholder="Search Allergens..."
                            notfoundText={"Allergen Not found"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="filter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filters and Attributes</FormLabel>
                        <FormControl>
                          <MultiSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={filterOptions}
                            placeholder="Select Filter"
                            searchPlaceholder="Search Filter..."
                            notfoundText={"Filter Not found"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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

ProductAdd.route = "/ProductAdd";
