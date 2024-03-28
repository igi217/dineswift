import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFilterAttribute } from "@/hooks/db_query";
import React from "react";

export interface FILTERSHEET {
  setFilter: React.Dispatch<React.SetStateAction<string[]>>;
  filters: string[];
}
export function FILTERSHEET(props: FILTERSHEET) {
  const { filters, setFilter } = props;
  const [filterAttributes] = useFilterAttribute(true);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="font-bold" variant="ghost">
          <i className="fa-solid fa-filter-list text-green-500 text-lg mr-1"></i>
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        {filterAttributes?.map((item) => (
          <div key={item._id}>
            <h1 className="text-sm font-semibold my-2">{item.attribute}</h1>
            {item.filters.map((filter) => (
              <div
                key={filter._id}
                className="flex items-center my-3 space-x-2"
              >
                <input
                  className="accent-cyan-600 checked:after:bg-white"
                  name={item._id}
                  type="checkbox"
                  id={filter._id}
                  onChange={() => {
                    setFilter((prev) => {
                      if (prev.includes(filter.value)) {
                        return prev.filter((item) => item !== filter.value);
                      }
                      return [...prev, filter.value];
                    });
                  }}
                  checked={filters.includes(filter.value)}
                />
                <Label htmlFor={filter._id}>{filter.value}</Label>
              </div>
            ))}
          </div>
        ))}
      </SheetContent>
    </Sheet>
  );
}
