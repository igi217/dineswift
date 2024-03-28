import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { numberFormatter } from "@/lib/utils";
import { useCustomer } from "@/hooks/db_query";
import React from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function SalesDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [customers] = useCustomer();

  const isFiltered = table.getState().columnFilters.length > 0;

  const statuses = [
    {
      value: "0",
      label: "Pending",
    },
    {
      value: "2",
      label: "Canceled",
    },
    {
      value: "1",
      label: "Success",
    },
  ];

  const prices = [
    {
      value: "10",
      label: `Above ${numberFormatter.format(10)}`,
    },
    {
      value: "50",
      label: `Above ${numberFormatter.format(50)}`,
    },
    {
      value: "100",
      label: `Above ${numberFormatter.format(100)}`,
    },
    {
      value: "200",
      label: `Above ${numberFormatter.format(200)}`,
    },
    {
      value: "500",
      label: `Above ${numberFormatter.format(500)}`,
    },
  ];

  const order_type = [
    {
      value: "Dine in",
      label: "Dine in",
    },
    {
      value: "Collection",
      label: "Collection",
    },
    {
      value: "Take away",
      label: "Take away",
    },
    {
      value: "Delivery",
      label: "Delivery",
    },
  ];

  const progresses = [
    {
      value: "10%",
      label: "Above 10%",
    },
    {
      value: "20%",
      label: "Above 20%",
    },
    {
      value: "30%",
      label: "Above 30%",
    },
    {
      value: "40%",
      label: "Above 40%",
    },
    {
      value: "50%",
      label: "Above 50%",
    },
    {
      value: "60%",
      label: "Above 60%",
    },
    {
      value: "70%",
      label: "Above 70%",
    },
    {
      value: "80%",
      label: "Above 80%",
    },
    {
      value: "90%",
      label: "Above 90%",
    },
    {
      value: "100%",
      label: "100%",
    },
  ];

  const customerOptions = React.useMemo(
    () =>
      customers?.map((item) => ({ value: item.name, label: item.name })) ?? [],
    [customers]
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("amount") && (
          <DataTableFacetedFilter
            column={table.getColumn("amount")}
            title="Amount"
            options={prices}
          />
        )}
        {table.getColumn("expense") && (
          <DataTableFacetedFilter
            column={table.getColumn("expense")}
            title="Cost"
            options={prices}
          />
        )}
        {table.getColumn("total_discount") && (
          <DataTableFacetedFilter
            column={table.getColumn("total_discount")}
            title="Discount"
            options={prices}
          />
        )}
        {table.getColumn("order_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("order_type")}
            title="Type"
            options={order_type}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("order_progress") && (
          <DataTableFacetedFilter
            column={table.getColumn("order_progress")}
            title="Progress"
            options={progresses}
          />
        )}
        {table.getColumn("customer_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("customer_name")}
            title="Customer"
            options={customerOptions}
          />
        )}

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
      <DataTableViewOptions table={table} />
    </div>
  );
}
