import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Area } from "@/db/index.type";
import { useAreaList } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import AreaAction from "@/components/ui/area-action";
import { AreaTableToolbar } from "@/components/ui/area-table-toolbar";
import { DataTable } from "@/components/ui/data-table";
import { ScrollBar } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/ui/table-header";

export const columns: ColumnDef<Area>[] = [
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
    cell: ({ row }) => <AreaAction id={row.getValue("_id")} />,
  },
];
export default function Area() {
  const [areas] = useAreaList();

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Area</CardTitle>
              <CardDescription>List of Area</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => <AreaTableToolbar table={table} />}
                data={areas ?? []}
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

Area.route = "/Area";
