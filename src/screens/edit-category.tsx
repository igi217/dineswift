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
import { GradientPicker } from "@/components/ui/gradient-picker";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { Category, DBCollections } from "@/db/index.type";
import { deleteFile, uploadFile } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "You must fill this field" }),
  image: z.string(),
  color: z.string().min(1, { message: "You must fill this field" }),
  backgroundColor: z.string().min(1, { message: "You must fill this field" }),
  dine_in_show: z.boolean(),
  collection_show: z.boolean(),
  take_away_show: z.boolean(),
  delivery_show: z.boolean(),
  description: z.string(),
  total_tax: z.string().transform((value) => +value),
  modified: z.number(),
  _id: z.string(),
  _rev: z.string(),
});
export default function CategoryEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [file, setFile] = React.useState<FileList>([] as any);

  const defaultValues = {
    name: "",
    image: "",
    color: "#FFF",
    backgroundColor: "#6366f1",
    dine_in_show: true,
    collection_show: true,
    take_away_show: true,
    delivery_show: true,
    description: "",
    total_tax: 0,
    modified: Date.now(),
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    if (file.length > 0) {
      let filePath = await uploadFile(file[0]);

      await deleteFile(value.image);

      if (filePath !== false) {
        value = { ...value, image: filePath };
      }
    }
    try {
      await db.put({
        table: DBCollections.CATEGORY,
        ...value,
      });

      toast.success("Category Saved");
      navigate(-1);
    } catch (err: any) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    (async () => {
      if (!id) return;

      let data: Category = await db.get(id);
      form.reset({ ...data, modified: Date.now() });
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
              <CardTitle>Update Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
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
                        <FormLabel>Category Description</FormLabel>
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
                        <FormLabel>Category Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              setFile(e.target.files as any);
                            }}
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
                        <FormLabel>Category Background Color</FormLabel>
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
                        <FormLabel>Category Foreground Color</FormLabel>
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
                    name="total_tax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax percentage</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step={0.01}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                            onBlur={() => {
                              field.onBlur();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dine_in_show"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center my-3">
                        <FormLabel className="mt-2">
                          Available in Dine-In ?
                        </FormLabel>
                        <FormControl>
                          <Switch
                            className="ml-2"
                            onCheckedChange={field.onChange}
                            checked={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="collection_show"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center my-3">
                        <FormLabel className="mt-2">
                          Available in Collection ?
                        </FormLabel>
                        <FormControl>
                          <Switch
                            className="ml-2"
                            onCheckedChange={field.onChange}
                            checked={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="take_away_show"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center my-3">
                        <FormLabel className="mt-2">
                          Available in Take Away ?
                        </FormLabel>
                        <FormControl>
                          <Switch
                            className="ml-2"
                            onCheckedChange={field.onChange}
                            checked={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="delivery_show"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center my-3">
                        <FormLabel className="mt-2">
                          Available in Delivery ?
                        </FormLabel>
                        <FormControl>
                          <Switch
                            className="ml-2"
                            onCheckedChange={field.onChange}
                            checked={field.value}
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

CategoryEdit.route = "/CategoryEdit/:id";
