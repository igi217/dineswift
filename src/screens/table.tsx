import { SidebarComponent } from "@/components/SidebarComponent";
import { TabList } from "@/components/ui/custom-tab";
import { useAreaList, useTableList } from "@/hooks/db_query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import BookingDialog from "@/components/ui/booking-dialog";
import { db } from "@/db";
import { type Table } from "@/db/index.type";
import { cn, resolveRoute } from "@/lib/utils";
import React from "react";
import { useNavigate } from "react-router-dom";
import TableAdd from "./add-table";
import TableEdit from "./edit-table";

export default function Table() {
  const [areas] = useAreaList();
  const [tab, setTab] = React.useState("");
  const [tables] = useTableList(tab);
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState<Table[]>([]);

  React.useEffect(() => {
    setTab(areas?.at(0)?._id ?? "");
  }, [areas]);

  const servingClassName = "bg-gradient-to-r from-[#f857a6] to-[#ff5858]";

  const bookingClassName = "bg-gradient-to-r from-[#FF416C] to-[#FF4B2B]";

  const defaultClassName = "bg-gradient-to-r from-[#4776E6] to-[#8E54E9]";

  const handleEdit = (id: string) => {
    navigate(resolveRoute(TableEdit.route, { id }));
  };

  const handleDelete = async (id: string) => {
    let record = await db.get(id);

    await db.remove(record);
  };

  const isSelected = (table: Table) =>
    selected.some((item) => item._id == table._id);

  const handleSelect = (table: Table) => {
    let isSelected = selected.some((item) => item._id == table._id);

    if (isSelected) {
      setSelected((selected) => [
        ...selected.filter((item) => item._id !== table._id),
      ]);
    } else {
      setSelected((selected) => [...selected, table]);
    }
  };
  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <div className="flex-shrink-0 w-100 h-[50px] flex-row flex items-center justify-between bg-white shadow-md">
          {/* <div className="flex flex-row items-center justify-stretch h-full w-full max-w-[calc(100%-200px)]">
            {areas?.map((item) => (
              <button
                className="flex border-b-2 border-indigo-500 text-indigo-500 bg-gray-100 uppercase h-full font-semibold items-center justify-center px-4 h-100"
                key={item._id}
              >
                {item.name}
              </button>
            ))}
          </div> */}
          <TabList
            className="max-w-[calc(100%-200px)] overflow-clip"
            value={tab}
            setValue={setTab}
            tabs={areas?.map((item) => ({ label: item.name, value: item._id }))}
          />
          <div className="flex flex-row h-full">
            <BookingDialog tables={selected}>
              {selected.length ? (
                <button className="h-full bg-gray-100 uppercase font-semibold whitespace-nowrap flex flex-row items-center px-3 text-green-500">
                  <i className="fa-solid fa-check mr-1"></i>
                  {selected.length}
                  <span className="ml-1">Selected</span>
                </button>
              ) : (
                <></>
              )}
            </BookingDialog>
            <button
              onClick={() => navigate(TableAdd.route)}
              className="h-full bg-gray-100 uppercase font-semibold whitespace-nowrap flex flex-row items-center px-3"
            >
              <i className="fa-solid fa-circle-plus mr-2"></i>
              Add Table
            </button>
          </div>
        </div>
        <div className="h-full w-full lg:grid lg:grid-cols-4 p-3 gap-3">
          {tables?.map((table) => {
            let className = defaultClassName;
            if (table.status == 1) {
              className = servingClassName;
            }
            if (table.status == 2) {
              className = bookingClassName;
            }
            return (
              <ContextMenu key={table._id}>
                <ContextMenuTrigger asChild>
                  <Card
                    onClick={() => handleSelect(table)}
                    className={cn(
                      "shadow-lg h-fit min-h-[150px] flex flex-col justify-between cursor-pointer text-white",
                      className
                    )}
                    key={table._id}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-[18px]">
                        {table.name}
                      </CardTitle>
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
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleEdit(table._id)}>
                    <i className="fa-solid fa-edit mr-1"></i>
                    <span>Edit</span>
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleDelete(table._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fa-solid fa-trash mr-1"></i>
                    <span>Delete</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Table.route = "/Table";
