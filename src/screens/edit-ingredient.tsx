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
import { DBCollections, Ingredient } from "@/db/index.type";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "You must fill this field" }),
  cost: z.string().transform((value) => +value),
  price: z.string().transform((value) => +value),
  unit: z.string().min(1, { message: "You must enter an unit" }),
  stock: z.string().transform((value) => +value),
  alert: z.string().transform((value) => +value),
  modified: z.number(),
  _id: z.string(),
  _rev: z.string(),
});
export default function IngredientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const defaultValues = {
    name: "",
    cost: 0.0,
    price: 0.0,
    unit: "",
    stock: 0,
    alert: 0,
    modified: Date.now(),
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  React.useEffect(() => {
    (async () => {
      if (!id) return;

      let data: Ingredient = await db.get(id);
      form.reset({ ...data, modified: Date.now() });
    })();
  }, [id]);

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await db.put({
        table: DBCollections.INGREDIENT,
        ...value,
      });

      toast.success("Ingredient Saved");
      form.reset();
      navigate(-1);
    } catch (err: any) {
      console.error(err);
    }
  };
  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Update Ingredient</CardTitle>
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
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step={0.01}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step={0.01}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availble Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alert"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity Alert</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                            onBlur={field.onBlur}
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

IngredientEdit.route = "/IngredientEdit/:id";
