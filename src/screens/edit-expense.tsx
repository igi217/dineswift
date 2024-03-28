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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { DBCollections, Expense } from "@/db/index.type";
import { useExpenseType } from "@/hooks/db_query";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  modified: z.number(),
  expense_type_id: z
    .string()
    .min(1, { message: "You must select a Expense Type" }),
  description: z.string().min(1, { message: "You must fill this field" }),
  cost: z.string().transform((value) => +value),
  _id: z.string(),
  _rev: z.string(),
});
export default function ExpenseEdit() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [expensetypes] = useExpenseType();

  const [isLoading, setIsLoading] = React.useState(true);

  const defaultValues = {
    description: "",
    modified: Date.now(),
    expense_type_id: "",
    cost: 1,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await db.put({
        table: DBCollections.EXPENSE,
        ...value,
      });

      toast.success("Expense Updated");
      form.reset();
      navigate(-1);
    } catch (err: any) {
      console.error(err);
    }
  };
  React.useEffect(() => {
    (async () => {
      if (!id) return;

      let data: Expense = await db.get(id);
      form.reset({ ...data, modified: Date.now() });
      setIsLoading(false);
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
              <CardTitle>Update Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="expense_type_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expense Type</FormLabel>
                        <Select
                          onValueChange={
                            !isLoading ? field.onChange : undefined
                          }
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Expense Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {expensetypes?.map((item) => (
                              <SelectItem key={item._id} value={item._id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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

ExpenseEdit.route = "/ExpenseEdit/:id";
