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
import { DBCollections, ModifierGroup } from "@/db/index.type";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "You must fill this field" }),
  color: z.string().min(1, { message: "You must fill this field" }),
  backgroundColor: z.string().min(1, { message: "You must fill this field" }),
  dine_in_show: z.boolean(),
  collection_show: z.boolean(),
  take_away_show: z.boolean(),
  delivery_show: z.boolean(),
  description: z.string(),
  modified: z.number(),
  _id: z.string(),
  _rev: z.string(),
});
export default function ModifierGroupUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const defaultValues = {
    name: "",
    color: "#FFF",
    backgroundColor: "#6366f1",
    dine_in_show: true,
    collection_show: true,
    take_away_show: true,
    delivery_show: true,
    description: "",
    modified: Date.now(),
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await db.put({
        table: DBCollections.MODIFIER_GROUP,
        ...value,
      });

      toast.success("Modifier Group Saved");
      form.reset();
      navigate(-1);
    } catch (err: any) {
      console.error(err.toString());
    }
  };

  React.useEffect(() => {
    (async () => {
      if (!id) return;

      let data: ModifierGroup = await db.get(id);
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
              <CardTitle>Update Modifier group</CardTitle>
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

ModifierGroupUpdate.route = "/ModifierGroupUpdate/:id";
