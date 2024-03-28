import Background from "@/assets/images/pos.jpg";
import { OrderType } from "@/db/index.type";
import { resolveRoute } from "@/lib/utils";
import React from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Department from "./department";
import Discount from "./discount";
import Filter from "./filter";
import GeneralSettings from "./general-settings";
import Printer from "./printer";
import Product from "./product";
import Table from "./table";
import Terminal from "./terminal";
import { KITCHENDISPLAY } from "./kitchen-display";
export default function POS() {
  const navigate = useNavigate();

  const [today, setToday] = React.useState(new Date());

  const openTerminal = (order_type: OrderType) => {
    let url = resolveRoute(Terminal.route, { order_type });

    navigate(url);
  };
  React.useEffect(() => {
    let interval = setInterval(() => {
      setToday(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);
  const currentDate = today.toLocaleDateString("en", {
    day: "2-digit",
    month: "long",
    weekday: "short",
  });
  const currentTime = today.toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <div className="overflow-hidden relative isolate bg-slate-100 h-full w-full flex flex-col justify-center items-center">
      <img
        src={Background}
        alt="Background"
        className="absolute h-full w-full -z-[1]"
      />
      <div className="h-full w-full flex flex-row gap-6 p-6 backdrop-blur-sm">
        <div className="w-1/4 flex flex-col relative">
          <div className="flex flex-col">
            <span className="text-white text-[43px] font-extralight">
              {currentTime}
            </span>
            <span className="text-white text-[15px] font-light">
              {currentDate}
            </span>
          </div>
          <div className="w-full absolute top-1/2 -translate-y-1/2 my-auto gap-2 grid grid-cols-2 grid-flow-row-dense">
            <div
              onClick={() => openTerminal(OrderType.DINE_IN)}
              className="p-3 shadow-md aspect-square bg-[rgba(255,255,255,0.3)] backdrop-blur-lg rounded-md transition-all cursor-pointer text-white flex flex-col"
            >
              <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#4776E6] to-[#8E54E9] shadow-lg shadow-[#8d54e977] backdrop-blur-lg flex justify-center items-center">
                <i className="fa-solid fa-pot-food"></i>
              </span>
              <span className="mt-auto font-extralight text-[17px]">
                Dine In
              </span>
            </div>
            <div
              onClick={() => openTerminal(OrderType.DELIVERY)}
              className="p-3 shadow-md aspect-square bg-[rgba(255,255,255,0.3)] backdrop-blur-lg rounded-md transition-all cursor-pointer text-white flex flex-col"
            >
              <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#FF8008] to-[#FFC837] shadow-lg shadow-[#ffc63762] backdrop-blur-lg flex justify-center items-center">
                <i className="fa-solid fa-moped"></i>
              </span>
              <span className="mt-auto font-extralight text-[17px]">
                Delivery
              </span>
            </div>
            <div
              onClick={() => openTerminal(OrderType.COLLECTION)}
              className="p-3 shadow-md aspect-square bg-[rgba(255,255,255,0.3)] backdrop-blur-lg rounded-md transition-all cursor-pointer text-white flex flex-col"
            >
              <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#00b09b] to-[#96c93d] shadow-lg shadow-[#96c93d53] backdrop-blur-lg flex justify-center items-center">
                <i className="fa-solid fa-bag-shopping"></i>
              </span>
              <span className="mt-auto font-extralight text-[17px]">
                Collection
              </span>
            </div>

            <div
              onClick={() => openTerminal(OrderType.TAKE_AWAY)}
              className="p-3 shadow-md aspect-square bg-[rgba(255,255,255,0.3)] backdrop-blur-lg rounded-md transition-all cursor-pointer text-white flex flex-col"
            >
              <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#f857a6] to-[#ff5858] shadow-lg shadow-[#f857a578] backdrop-blur-lg flex justify-center items-center">
                <i className="fa-solid fa-burger-fries"></i>
              </span>
              <span className="mt-auto font-extralight text-[17px]">
                Take Away
              </span>
            </div>
            <div
              onClick={() =>
                navigate(
                  resolveRoute(KITCHENDISPLAY.route, { order_type: "dine_in" })
                )
              }
              className="p-3 col-span-2 shadow-md bg-[rgba(255,255,255,0.3)] backdrop-blur-lg rounded-md transition-all cursor-pointer text-white flex flex-row items-center"
            >
              <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#f857a6] to-[#ff5858] shadow-lg shadow-[#f857a578] backdrop-blur-lg flex justify-center items-center">
                <i className="fa-solid fa-kitchen-set"></i>
              </span>
              <span className="font-extralight ml-2 text-[17px]">
                Kitchen Display System
              </span>
            </div>
          </div>
        </div>
        <div className="w-3/4 grid-cols-2 grid gap-4 grid-flow-row-dense  content-center">
          <div
            onClick={() => navigate(Dashboard.route)}
            className="p-2 cursor-pointer gap-2 text-white text-lg rounded-lg bg-[rgba(255,255,255,0.3)] backdrop-blur-sm flex flex-row items-center"
          >
            <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#4776E6] to-[#8E54E9] shadow-lg shadow-[#8d54e977] backdrop-blur-lg flex justify-center items-center">
              <i className="fa-solid fa-home"></i>
            </span>
            Home
          </div>
          <div
            onClick={() => navigate(Product.route)}
            className="p-2 cursor-pointer gap-2 text-white text-lg rounded-lg bg-[rgba(255,255,255,0.3)] backdrop-blur-sm flex flex-row items-center"
          >
            <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#FF8008] to-[#FFC837] shadow-lg shadow-[#ffc63762] backdrop-blur-lg flex justify-center items-center">
              <i className="fa-solid fa-pot-food"></i>
            </span>
            Items Management
          </div>
          <div
            onClick={() => navigate(Filter.route)}
            className="p-2 cursor-pointer gap-2 text-white text-lg rounded-lg bg-[rgba(255,255,255,0.3)] backdrop-blur-sm flex flex-row items-center"
          >
            <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#ec008c] to-[#fc6767] shadow-lg shadow-[#96c93d53] backdrop-blur-lg flex justify-center items-center">
              <i className="fa-solid fa-filter-list"></i>
            </span>
            Filter Functions
          </div>
          <div
            onClick={() => navigate(Printer.route)}
            className="p-2 cursor-pointer gap-2 text-white text-lg rounded-lg bg-[rgba(255,255,255,0.3)] backdrop-blur-sm flex flex-row items-center"
          >
            <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#1D976C] to-[#93F9B9] shadow-lg shadow-[#96c93d53] backdrop-blur-lg flex justify-center items-center">
              <i className="fa-solid fa-print"></i>
            </span>
            Printer Functions
          </div>
          <div
            onClick={() => navigate(Department.route)}
            className="p-2 cursor-pointer gap-2 text-white text-lg rounded-lg bg-[rgba(255,255,255,0.3)] backdrop-blur-sm flex flex-row items-center"
          >
            <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#f857a6] to-[#ff5858] shadow-lg shadow-[#96c93d53] backdrop-blur-lg flex justify-center items-center">
              <i className="fa-solid fa-house-building"></i>
            </span>
            Departments
          </div>
          <div
            onClick={() => navigate(Discount.route)}
            className="p-2 cursor-pointer gap-2 text-white text-lg rounded-lg bg-[rgba(255,255,255,0.3)] backdrop-blur-sm flex flex-row items-center"
          >
            <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#AC32E4] via-[#7918F2] to-[#4801FF] shadow-lg shadow-[#96c93d53] backdrop-blur-lg flex justify-center items-center">
              <i className="fa-solid fa-tag"></i>
            </span>
            Discount Functions
          </div>
          <div
            onClick={() => navigate(Table.route)}
            className="p-2 cursor-pointer gap-2 text-white text-lg rounded-lg bg-[rgba(255,255,255,0.3)] backdrop-blur-sm flex flex-row items-center"
          >
            <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#00b09b] to-[#96c93d] shadow-lg shadow-[#96c93d53] backdrop-blur-lg flex justify-center items-center">
              <i className="fa-solid fa-table-picnic"></i>
            </span>
            Table Functions
          </div>
          <div
            onClick={() => navigate(GeneralSettings.route)}
            className="p-2 cursor-pointer gap-2 text-white text-lg rounded-lg bg-[rgba(255,255,255,0.3)] backdrop-blur-sm flex flex-row items-center"
          >
            <span className="w-[50px] aspect-square rounded-lg bg-gradient-to-r from-[#f77062] to-[#fe5196] shadow-lg shadow-[#96c93d53] backdrop-blur-lg flex justify-center items-center">
              <i className="fa-solid fa-cog"></i>
            </span>
            Settings
          </div>
        </div>
      </div>
    </div>
  );
}
POS.route = "/POS";
/**
 * 
 * <div className="flex flex-row items-center mt-20 gap-10">
        <div
          onClick={() => navigate(Dashboard.route)}
          className="cursor-pointer bg-gradient-to-r from-[#00B4DB] to-[#0083B0] w-[120px] flex flex-col items-center justify-center aspect-square rounded-md text-white shadow-lg transition-all hover:shadow-xl"
        >
          <i className="fa-duotone fa-home text-[27px]"></i>
          <span className="block text-lg mt-3">Home</span>
        </div>
        <div
          onClick={() => openTerminal(OrderType.DINE_IN)}
          className="cursor-pointer bg-gradient-to-r from-[#4776E6] to-[#8E54E9] w-[120px] flex flex-col items-center justify-center aspect-square rounded-md text-white shadow-lg transition-all hover:shadow-xl"
        >
          <i className="fa-duotone fa-pot-food text-[27px]"></i>
          <span className="block text-lg mt-3">Dine In</span>
        </div>
        <div
          onClick={() => openTerminal(OrderType.TAKE_AWAY)}
          className="cursor-pointer bg-gradient-to-r from-[#f857a6] to-[#ff5858] w-[120px] flex flex-col items-center justify-center aspect-square rounded-md text-white shadow-lg transition-all hover:shadow-xl"
        >
          <i className="fa-duotone fa-burger-fries text-[27px]"></i>
          <span className="block text-lg mt-3">Take Away</span>
        </div>
        <div
          onClick={() => openTerminal(OrderType.COLLECTION)}
          className="cursor-pointer bg-gradient-to-r from-[#00b09b] to-[#96c93d] w-[120px] flex flex-col items-center justify-center aspect-square rounded-md text-white shadow-lg transition-all hover:shadow-xl"
        >
          <i className="fa-duotone fa-bag-shopping text-[27px]"></i>
          <span className="block text-lg mt-3">Collection</span>
        </div>
        <div
          onClick={() => openTerminal(OrderType.DELIVERY)}
          className="bg-gradient-to-r from-[#c84e89] to-[#F15F79] cursor-pointer w-[120px] flex flex-col items-center justify-center aspect-square rounded-md text-white shadow-lg transition-all hover:shadow-xl"
        >
          <i className="fa-duotone fa-moped text-[27px]"></i>
          <span className="block text-lg mt-3">Delievry</span>
        </div>
      </div>
 */
