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
import { db } from "@/db";
import { DBCollections, Table } from "@/db/index.type";
import { useAreaList } from "@/hooks/db_query";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "You must fill this field" }),
  modified: z.number(),
  area_id: z.string().min(1, { message: "You must select a Area" }),
  capacity: z.string().transform((value) => +value),
  _id: z.string(),
  _rev: z.string(),
});
export default function TableEdit() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = React.useState(true);

  const navigate = useNavigate();

  const [areas] = useAreaList();

  const defaultValues = {
    name: "",
    modified: Date.now(),
    area_id: "",
    capacity: 0,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await db.put({
        table: DBCollections.TABLE,
        ...value,
      });

      toast.success("Table Saved");
      form.reset();
      navigate(-1);
    } catch (err: any) {
      console.error(err);
    }
  };
  React.useEffect(() => {
    (async () => {
      if (!id) return;

      let data: Table = await db.get(id);
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
              <CardTitle>Update Table</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="area_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area</FormLabel>
                        <Select
                          onValueChange={
                            !isLoading ? field.onChange : undefined
                          }
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {areas?.map((item) => (
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
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
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

TableEdit.route = "/TableEdit/:id";
