import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Expense, ExpenseType } from "@/db/index.type";
import { useExpenses } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import ExpenseAction from "@/components/ui/expense-action";
import { ExpenseTableToolbar } from "@/components/ui/expense-table-toolbar";
import { ScrollBar } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/ui/table-header";
import { numberFormatter } from "@/lib/utils";

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "expense_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expense Type" />
    ),
    cell: ({ row }) => row.getValue<ExpenseType>("expense_type")?.name,
  },
  {
    accessorKey: "cost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cost" />
    ),
    cell: ({ row }) => numberFormatter.format(row.getValue("cost")),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => row.getValue("description"),
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
    cell: ({ row }) => <ExpenseAction id={row.getValue("_id")} />,
  },
];
export default function Expense() {
  const [expenses] = useExpenses();

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>Expense</CardTitle>
              <CardDescription>List of Expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => <ExpenseTableToolbar table={table} />}
                data={expenses ?? []}
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

Expense.route = "/Expense";
