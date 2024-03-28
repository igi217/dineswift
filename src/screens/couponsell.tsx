import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Coupon, CouponSell, Customer } from "@/db/index.type";
import { useCouponSells } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import CouponSellAction from "@/components/ui/couponsell-action";
import { DataTable } from "@/components/ui/data-table";
import { ScrollBar } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/ui/table-header";

export const columns: ColumnDef<CouponSell>[] = [
  {
    accessorKey: "coupon",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Coupon" />
    ),
    cell: ({ row }) => row.getValue<Coupon>("coupon")?.name,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => row.getValue<Customer>("customer")?.name,
  },
  {
    accessorKey: "modified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sold On" />
    ),
    cell: ({ row }) => new Date(row.getValue("modified")).toLocaleString(),
  },
  {
    id: "_id",
    accessorKey: "_id",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => <CouponSellAction id={row.getValue("_id")} />,
  },
];
export default function CouponSells() {
  const [couponsells] = useCouponSells();

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Coupon Sells</CardTitle>
              <CardDescription>List of Coupon Sells</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={() => <></>}
                data={couponsells ?? []}
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

CouponSells.route = "/CouponSells";
