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
import { DBCollections, Printer } from "@/db/index.type";
import { usePrinters } from "@/hooks/printer";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  device_name: z
    .string()
    .min(1, { message: "You must select a prining device" }),
  name: z.string().min(1, { message: "You must fill this field" }),
  modified: z.number(),
  paper_size: z.string().transform((value) => +value),
  _id: z.string(),
  _rev: z.string(),
  id: z.string().min(1, { message: "You must select a printing device" }),
});
export default function PrinterEdit() {
  const printers = usePrinters();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const defaultValues = {
    name: "",
    device_name: "",
    modified: Date.now(),
    paper_size: 0.0,
    id: "",
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await db.put({
        table: DBCollections.PRINTER,
        ...value,
      });

      toast.success("Printer Saved");
      form.reset();
      navigate(-1)
    } catch (err: any) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    (async () => {
      if (!id) return;

      let data: Printer = await db.get(id);
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
              <CardTitle>Update Printer</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="device_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Printing Device</FormLabel>
                        <Select
                          onValueChange={
                            !isLoading ? field.onChange : undefined
                          }
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Printer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {printers?.map((item) => (
                              <SelectItem
                                key={item.id}
                                onSelect={() => form.setValue("id", item.id)}
                                value={item.name}
                              >
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
                    name="paper_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paper Width (In)</FormLabel>
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

PrinterEdit.route = "/PrinterEdit/:id";
