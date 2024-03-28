import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Order, OrderStatusMap } from "@/db/index.type";
import { useOrderHistory } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";
import BarCode from "react-barcode";

import { DataTable } from "@/components/ui/data-table";
import { SalesDataTableToolbar } from "@/components/ui/sales-table-toolbar";
import { ScrollBar } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/ui/table-header";
import { numberFormatter } from "@/lib/utils";

export const columns: ColumnDef<Order>[] = [
  {
    id: "tracking",
    accessorKey: "modified",
    header: "Tracking",
    cell: ({ row }) => (
      <BarCode
        displayValue={false}
        width={0.7}
        height={27}
        value={row.getValue<string>("modified").toString() ?? ""}
      />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => (
      <span>{numberFormatter.format(row.getValue("amount") ?? 0)}</span>
    ),
    filterFn: (row, id, value) => {
      return value.some(
        (item: string) => Number(item) < row.getValue<number>(id)
      );
    },
  },
  {
    accessorKey: "expense",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cost" />
    ),
    cell: ({ row }) => (
      <span>{numberFormatter.format(row.getValue("expense") ?? 0)}</span>
    ),
    filterFn: (row, id, value) => {
      return value.some(
        (item: string) => Number(item) < (row.getValue<number>(id) ?? 0)
      );
    },
  },
  {
    accessorKey: "total_discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" />
    ),
    cell: ({ row }) => (
      <span>{numberFormatter.format(row.getValue("total_discount") ?? 0)}</span>
    ),
    filterFn: (row, id, value) => {
      return value.some(
        (item: string) => Number(item) < (row.getValue<number>(id) ?? 0)
      );
    },
  },
  {
    accessorKey: "order_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <span>{row.getValue("order_type")}</span>,
    filterFn: (row, id, value) => {
      return value.some((item: string) => item == row.getValue<string>(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <span>{OrderStatusMap.get(row.getValue("status"))}</span>
    ),
    filterFn: (row, id, value: any) => {
      return value.some((item: any) => item == row.getValue(id));
    },
  },
  {
    accessorKey: "order_progress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Progress" />
    ),
    cell: ({ row }) => <span>{row.getValue("order_progress") ?? 0}%</span>,
    filterFn: (row, id, value: any) => {
      return value.some((item: any) =>
        item == "100%"
          ? parseFloat(item) == row.getValue<number>(id)
          : parseFloat(item) < row.getValue<number>(id)
      );
    },
  },
  {
    id: "customer_name",
    accessorKey: "customer_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => <span>{row.getValue("customer_name")}</span>,
    filterFn: (row, id, value) => {
      return value.some((item: any) => item == row.getValue(id));
    },
  },

  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => <span>{row.getValue("address")}</span>,
  },
  {
    accessorKey: "modified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <span>{new Date(row.getValue("modified")).toLocaleString()}</span>
    ),
  },
];
export default function Sales() {
  const [orders] = useOrderHistory([]);

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Sales</CardTitle>
              <CardDescription>
                A Overview and History of your sales and orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => <SalesDataTableToolbar table={table} />}
                data={orders || []}
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

Sales.route = "/Sales";
