import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ModifierGroup } from "@/db/index.type";
import { useModifierGroups } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import ModifiergroupAction from "@/components/ui/modifiergroup-action";
import { ModifierGroupToolBar } from "@/components/ui/modifiergroup-table-toolbar";
import { ScrollBar } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/ui/table-header";

export const columns: ColumnDef<ModifierGroup>[] = [
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
    cell: ({ row }) => <ModifiergroupAction id={row.getValue("_id")} />,
  },
];
export default function ModifierGroup() {
  const [modifier_groups] = useModifierGroups();

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Modifier Group</CardTitle>
              <CardDescription>List of Modifier groups</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => <ModifierGroupToolBar table={table} />}
                data={modifier_groups ?? []}
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

ModifierGroup.route = "/ModifierGroup";
