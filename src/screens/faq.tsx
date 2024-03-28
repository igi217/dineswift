import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FAQ } from "@/db/index.type";
import { useFaqList } from "@/hooks/db_query";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import FaqAction from "@/components/ui/faq-action";
import { FaqTableToolbar } from "@/components/ui/faq-table-toolbar";
import { ScrollBar } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/ui/table-header";

export const columns: ColumnDef<FAQ>[] = [
  {
    accessorKey: "question",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Question" />
    ),
    cell: ({ row }) => row.getValue("question"),
    filterFn: (row, id, value) => row.getValue<string>(id)?.includes(value),
  },
  {
    accessorKey: "answer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Answer" />
    ),
    cell: ({ row }) => row.getValue("answer"),
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
    cell: ({ row }) => <FaqAction id={row.getValue("_id")} />,
  },
];
export default function Faq() {
  const [faqs] = useFaqList();

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 p-3">
          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>List of FAQs</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                toolbar={(table) => <FaqTableToolbar table={table} />}
                data={faqs ?? []}
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

Faq.route = "/Faq";
