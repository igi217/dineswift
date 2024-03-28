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
import Img from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { API } from "@/constants";
import { db } from "@/db";
import { deleteFile, uploadFile } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  primaryColor: z.string().min(1, { message: "You must fill this field" }),
  modified: z.number(),
  logoImage: z.string(),
  _id: z.string(),
  _rev: z.string().optional(),
});
export default function AppearenceSettings() {
  const defaultValues = {
    primaryColor: "#f01543",
    modified: Date.now(),
    logoImage: "",
    _id: "config/_appearence",
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

      await deleteFile(value.logoImage);

      if (filePath !== false) {
        value = { ...value, logoImage: filePath };
      }
    }

    try {
      console.log(value);
      await db.put(value);
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
              <CardTitle>Appearence Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <FormControl>
                          <GradientPicker
                            className="w-full"
                            background={field.value}
                            setBackground={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logoImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo</FormLabel>
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

AppearenceSettings.route = "/AppearenceSettings";
