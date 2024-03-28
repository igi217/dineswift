import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import Loading from "@/components/Loading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { db } from "@/db";
import { useAuthUserStore } from "@/stores/auth";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const formSchema = z
  .object({
    password: z.string().min(6, {
      message: "Password Must be atlease 6 characters long",
    }),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password == schema.confirmPassword, {
    message: "Password and Confirm Password didn't match",
    path: ["confirmPassword"],
  });

export default function ChangePassword() {
  const navigate = useNavigate();

  const [user, setUser] = useAuthUserStore();

  const [ready, setReady] = React.useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setReady(false);

    let updatedUser = { ...user, password: values.password };

    await db.put(updatedUser);

    updatedUser = await db.get(user!._id);

    localStorage.setItem(
      "@auth_store",
      JSON.stringify({
        username: updatedUser.username,
        password: updatedUser.password,
      })
    );

    setUser(updatedUser as any);
    setReady(true);

    toast.success("Password Updated!");
  }

  return (
    <div className="w-full flex flex-row h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <div className="h-full flex items-center justify-center w-full">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>
                Deploy your new project in one-click.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="mt-3">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <CardFooter className="flex justify-between mt-3">
                    <Button
                      type="button"
                      onClick={() => navigate(-1)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Change</Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
          <Loading show={!ready} />
        </div>
      </div>
    </div>
  );
}

ChangePassword.route = "/ChangePassword";
