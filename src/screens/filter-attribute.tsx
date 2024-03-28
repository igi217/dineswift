import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FilterAttribute } from "@/db/index.type";
import { useFilterAttribute } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import FilterAttributeAction from "@/components/ui/filterattribute-action";
import { FilterAttributeTableToolbar } from "@/components/ui/filterattribute-table-toolbar";
import { ScrollBar } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/ui/table-header";

export const columns: ColumnDef<FilterAttribute>[] = [
  {
    accessorKey: "attribute",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attribute" />
    ),
    cell: ({ row }) => row.getValue("attribute"),
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
    cell: ({ row }) => <FilterAttributeAction id={row.getValue("_id")} />,
  },
];
export default function FilterAttribute() {
  const [filterattributes] = useFilterAttribute();

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Filter Attribute</CardTitle>
              <CardDescription>List of Filter Attributes</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => (
                  <FilterAttributeTableToolbar table={table} />
                )}
                data={filterattributes ?? []}
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

FilterAttribute.route = "/FilterAttribute";
