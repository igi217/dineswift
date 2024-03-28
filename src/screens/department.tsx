import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Department, Printer } from "@/db/index.type";
import { useDepartmentList } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import DepartmentAction from "@/components/ui/department-action";
import { DepartmentTableToolbar } from "@/components/ui/department-table-toolbar";
import { ScrollBar } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/ui/table-header";

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => row.getValue("name"),
    filterFn: (row, id, value) => row.getValue<string>(id)?.includes(value),
  },
  {
    accessorKey: "printer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Printer" />
    ),
    cell: ({ row }) => row.getValue<Printer>("printer")?.name,
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
    cell: ({ row }) => <DepartmentAction id={row.getValue("_id")} />,
  },
];
export default function Department() {
  const [departments] = useDepartmentList();

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Department</CardTitle>
              <CardDescription>List of Departments</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => <DepartmentTableToolbar table={table} />}
                data={departments ?? []}
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

Department.route = "/Department";
