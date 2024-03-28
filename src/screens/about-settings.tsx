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
import Img from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { API } from "@/constants";
import { db } from "@/db";
import { deleteFile, uploadFile } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  modified: z.number(),
  mainImage: z.string(),
  experiece_year: z.string(),
  total_customers: z.string(),
  total_branch: z.string(),
  _id: z.string(),
  _rev: z.string().optional(),
});
export default function AboutSettings() {
  const defaultValues = {
    title: "",
    description: "",
    modified: Date.now(),
    mainImage: "",
    experiece_year: "",
    total_customers: "",
    total_branch: "",
    _id: "cms/_about",
  };
  const [file, setFile] = React.useState<File>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const loadSettings = async () => {
    let setting = await db.get(defaultValues._id);

    form.reset(setting);
  };
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    if (file) {
      let filePath = await uploadFile(file);

      await deleteFile(value.mainImage);

      if (filePath !== false) {
        value = { ...value, mainImage: filePath };
      }
    }

    try {
      console.log(value);
      await db.put(value);
      loadSettings();
      toast.success("Content Saved");
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
              <CardTitle>About Page</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mainImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              setFile(e.target.files![0]);
                              field.onChange(e);
                            }}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                        <Img
                          src={API.BASE_URL + field.value}
                          className="w-[120px] min-h-[80px] object-scale-down"
                        />
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
                    name="experiece_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Years of Experience</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Branches</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_customers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Customers</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="mt-3" type="submit">
                    Save
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

AboutSettings.route = "/AboutSettings";
