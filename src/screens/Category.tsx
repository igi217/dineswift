import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category } from "@/db/index.type";
import { useCategoryList } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import CategoryAction from "@/components/ui/category-action";
import { CategoryTableToolbar } from "@/components/ui/category-table-toolbar";
import { DataTable } from "@/components/ui/data-table";
import Img from "@/components/ui/image";
import { ScrollBar } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/ui/table-header";
import { API } from "@/constants";

export const columns: ColumnDef<Category>[] = [
  {
    id: "image",
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Img
        className="w-[80px] bg-gray-300 object-cover h-[50px]"
        src={API.BASE_URL + row.getValue("image")}
        alt="Category"
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
    cell: ({ row }) => <CategoryAction id={row.getValue("_id")} />,
  },
];
export default function Category() {
  const [category] = useCategoryList();

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
              <CardDescription>
                Food Categories to integrate with Items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => <CategoryTableToolbar table={table} />}
                data={category ?? []}
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

Category.route = "/Category";
