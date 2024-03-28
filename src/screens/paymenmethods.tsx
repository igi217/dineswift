import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PaymentMethods } from "@/db/index.type";
import { usePaymentMethods } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import PaymentMethodAction from "@/components/ui/paymentmethod-action";
import { PaymentMethodTableToolbar } from "@/components/ui/paymentmethod-table-toolbar";
import { ScrollBar } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/ui/table-header";

export const columns: ColumnDef<PaymentMethods>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => row.getValue("name"),
    filterFn: (row, id, value) => row.getValue<string>(id)?.includes(value),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) =>
      row.getValue<boolean>("status") ? "Active" : "Inactive",
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
    cell: ({ row }) => (
      <PaymentMethodAction
        delete={!row.getValue<boolean>("default")}
        id={row.getValue("_id")}
      />
    ),
  },
  {
    id: "default",
    accessorKey: "default",
    header: "",
    cell: () => "",
  },
];
export default function PaymentMethod() {
  const [paymentmethods] = usePaymentMethods();

  console.log(paymentmethods);

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>List of Payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => <PaymentMethodTableToolbar table={table} />}
                data={paymentmethods ?? []}
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

PaymentMethod.route = "/PaymentMethod";
