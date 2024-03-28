import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollBar } from "@/components/ui/scroll-area";
import { OrderType, Table } from "@/db/index.type";
import { useTableList } from "@/hooks/db_query";
import { cn } from "@/lib/utils";
import { useOrderStore } from "@/stores/order.store";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useParams } from "react-router-dom";

export type Params = {
  order_type: OrderType;
};
export function TABLEDIALOG() {
  const { order_type } = useParams<Params>();
  const TABLECLASS_MAP: Record<any, any> = {
    1: "bg-gradient-to-r from-[#f857a6] to-[#ff5858]",
    2: "bg-gradient-to-r from-[#FF416C] to-[#FF4B2B]",
    default: "bg-gradient-to-r from-[#4776E6] to-[#8E54E9]",
    get: (index: number) =>
      TABLECLASS_MAP.hasOwnProperty(index)
        ? TABLECLASS_MAP[index]
        : TABLECLASS_MAP["default"],
  };

  const { tables, setOrderStore } = useOrderStore((state) => ({
    tables: state.tables,
    setOrderStore: state.setOrderStore,
  }));
  const [tableList] = useTableList();
  const isSelected = (table: Table) =>
    tables.some((item) => item._id == table._id);

  const handleSelect = (table: Table) => {
    if (isSelected(table)) {
      setOrderStore({
        tables: tables.filter((item) => item._id !== table._id),
      });
    } else {
      setOrderStore({ tables: [...tables, table] });
    }
  };
  if (order_type != OrderType.DINE_IN) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold" variant="ghost">
          <i className="fa-solid fa-table-picnic text-violet-500 text-lg mr-1"></i>
          Tables
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[800px] max-w-none">
        <DialogHeader>
          <DialogTitle>Tables</DialogTitle>
          <ScrollArea className="w-full h-full grid grid-cols-3 gap-6">
            {tableList?.map((table) => {
              let className = TABLECLASS_MAP.get(table.status);
              return (
                <Card
                  onClick={() => handleSelect(table)}
                  className={cn(
                    "shadow-lg h-fit min-h-[150px] flex flex-col justify-between cursor-pointer text-white",
                    className
                  )}
                  key={table._id}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-[18px]">{table.name}</CardTitle>
                    {!isSelected(table) ? (
                      <span className="bg-white text-black text-sm rounded-lg p-1 px-2">
                        <i
                          className={cn(
                            "fa-solid fa-user mr-1 bg-clip-text text-transparent",
                            className
                          )}
                        ></i>
                        <span
                          className={cn(
                            "bg-clip-text text-transparent",
                            className
                          )}
                        >
                          {table.capacity}
                        </span>
                      </span>
                    ) : (
                      <span className="bg-white text-black text-sm rounded-lg p-1 px-2">
                        <i
                          className={cn(
                            "fa-solid fa-check mx-1 bg-clip-text text-transparent",
                            className
                          )}
                        ></i>
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="text-sm">
                    {table.status === 0 ? (
                      <>
                        <i className="fa-solid fa-exclamation-circle mr-1 text-xs"></i>
                        No Order
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-check-circle mr-1 text-xs"></i>
                        {table.status_message}
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            <ScrollBar />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
