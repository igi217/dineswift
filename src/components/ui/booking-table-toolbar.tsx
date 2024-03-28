import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import BookingAdd from "@/screens/add-booking";
import { useNavigate } from "react-router-dom";
import { Input } from "./input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function BookingTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Customer..."
          value={
            (table.getColumn("customer_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("customer_name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        onClick={() => navigate(BookingAdd.route)}
        className="bg-indigo-500 hover:bg-indigo-600 mr-3"
        size={"sm"}
      >
        Create Booking
      </Button>
      <DataTableViewOptions table={table} />
    </div>
  );
}
