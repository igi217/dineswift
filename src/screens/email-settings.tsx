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
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  from_email: z.string().email({ message: "Must be a valid email address" }),
  from_name: z.string().min(1, { message: "Must be a valid name" }),
  smtp_host: z.string().min(1, { message: "Must be a valid host" }),
  smtp_user: z.string().min(1, { message: "Must be a valid email address" }),
  smtp_pass: z.string(),
  smtp_port: z.string().min(1, { message: "Must be a vaid port" }),
  smtp_security: z
    .string()
    .min(1, { message: "Must be a valid security protocol" }),
  _id: z.string(),
  _rev: z.string().optional(),
});
export default function EmailSettings() {
  const defaultValues = {
    from_email: "set_your_mail@domain.com",
    from_name: "From Name",
    smtp_host: "127.0.0.1",
    smtp_user: "username@mailprovoder.com",
    smtp_pass: "",
    smtp_port: "465",
    smtp_security: "tls",
    _id: "config/_email",
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const loadSettings = async () => {
    let setting = await db.get(defaultValues._id);

    form.reset(setting);
  }
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      console.log(value);
      await db.put(value);
      loadSettings()

      toast.success("Settings Saved");
    } catch (err: any) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    loadSettings()
  }, []);
  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="from_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FROM EMAIL</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="from_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FROM NAME</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="smtp_host"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP HOST</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="smtp_port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP PORT</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="smtp_user"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP USERNAME</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="smtp_pass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP PASSWORD</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="smtp_security"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP SECURITY</FormLabel>
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

EmailSettings.route = "/EmailSettings";
