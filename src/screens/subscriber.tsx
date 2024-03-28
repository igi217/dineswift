import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Subscriber } from "@/db/index.type";
import { useSubscribers } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import { ScrollBar } from "@/components/ui/scroll-area";
import SubscriberAction from "@/components/ui/subscriber-action";
import { SubscriberTableToolbar } from "@/components/ui/subscriber-table-toolbar";
import { DataTableColumnHeader } from "@/components/ui/table-header";

export const columns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email Address" />
    ),
    cell: ({ row }) => row.getValue("email"),
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
    cell: ({ row }) => <SubscriberAction id={row.getValue("_id")} />,
  },
];
export default function Subscriber() {
  const [subscribers] = useSubscribers();

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Subscribers</CardTitle>
              <CardDescription>List of Subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => <SubscriberTableToolbar table={table} />}
                data={subscribers ?? []}
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

Subscriber.route = "/Subscriber";
