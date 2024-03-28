import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Category, Department, type Product } from "@/db/index.type";
import { useProductList } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import Img from "@/components/ui/image";
import { ScrollBar } from "@/components/ui/scroll-area";
import SetMealAction from "@/components/ui/setmeal-action";
import { SetMealTableToolbar } from "@/components/ui/setmeal-table-toolbar";
import { DataTableColumnHeader } from "@/components/ui/table-header";
import { API } from "@/constants";
import { numberFormatter } from "@/lib/utils";

export const columns: ColumnDef<Product>[] = [
  {
    id: "image",
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Img
        className="w-[80px] bg-gray-300 object-cover h-[50px]"
        src={API.BASE_URL + row.getValue("image")}
        alt="Product"
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => row.getValue("name"),
    filterFn: (row, id, value) => row.getValue<string>(id)?.includes(value),
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PLU Code" />
    ),
    cell: ({ row }) => row.getValue("code"),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => row.getValue<Category>("category")?.name,
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => row.getValue<Department>("department")?.name,
  },
  {
    accessorKey: "dine_in_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) =>
      numberFormatter.format(row.getValue<number>("dine_in_price")),
  },
  {
    accessorKey: "modified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => new Date(row.getValue("modified")).toLocaleString(),
  },
  {
    id: "_id",
    accessorKey: "_id",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => <SetMealAction id={row.getValue("_id")} />,
  },
];
export default function SetMeal() {
  const [products] = useProductList({
    is_setmeal: true,
  });

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Set-Meal</CardTitle>
              <CardDescription>List of Set-Meals</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => <SetMealTableToolbar table={table} />}
                data={products ?? []}
                columns={columns}
              />
            </CardContent>
          </Card>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}

SetMeal.route = "/SetMeal";
