import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, type Booking, OrderStatusMap } from "@/db/index.type";
import { useBookingList } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import BookingAction from "@/components/ui/booking-action";
import { BookingTableToolbar } from "@/components/ui/booking-table-toolbar";
import { DataTable } from "@/components/ui/data-table";
import { ScrollBar } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/ui/table-header";

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "customer_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Name" />
    ),
    cell: ({ row }) => row.getValue("customer_name"),
    filterFn: (row, id, value) => row.getValue<string>(id)?.includes(value),
  },
  {
    accessorKey: "tableData",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tables" />
    ),
    cell: ({ row }) =>
      row
        .getValue<Table[]>("tableData")
        ?.map((item) => item?.name)
        .join(","),
  },
  {
    accessorKey: "guest",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number of Guests" />
    ),
    cell: ({ row }) => row.getValue("guest"),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => OrderStatusMap.get(row.getValue("status")),
  },
  {
    accessorKey: "datetime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reservation Time" />
    ),
    cell: ({ row }) => new Date(row.getValue("datetime")).toLocaleString(),
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
    cell: ({ row }) => <BookingAction id={row.getValue("_id")} />,
  },
];
export default function Booking() {
  const [bookings] = useBookingList();

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Booking</CardTitle>
              <CardDescription>Table Reservation List</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => <BookingTableToolbar table={table} />}
                data={bookings ?? []}
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

Booking.route = "/Booking";
