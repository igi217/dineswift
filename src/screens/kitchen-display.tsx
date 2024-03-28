import { MenuCard } from "@/components/kds/card";
import { Button } from "@/components/ui/button";
import { ListView } from "@/components/utility/ListView";
import { OrderType } from "@/db/index.type";
import { userOrderListByType } from "@/hooks/db_query";
import { cn, resolveRoute } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import POS from "./pos";

export type Params = {
  order_type: OrderType;
};
const ORDER_BUTTONS = [
  {
    type: OrderType.DINE_IN,
    activeClassName: "bg-gradient-to-r from-[#4776E6] to-[#8E54E9]",
    label: "DINE IN",
    icon: "fa-pot-food",
  },
  {
    type: OrderType.TAKE_AWAY,
    activeClassName: "bg-gradient-to-r from-[#f857a6] to-[#ff5858]",
    label: "TAKE AWAY",
    icon: "fa-burger-fries",
  },
  {
    type: OrderType.COLLECTION,
    activeClassName: "bg-gradient-to-r from-[#00b09b] to-[#96c93d]",
    label: "COLLECTION",
    icon: "fa-bag-shopping",
  },
  {
    type: OrderType.DELIVERY,
    activeClassName: "bg-gradient-to-r from-[#c84e89] to-[#F15F79]",
    label: "DELIVERY",
    icon: "fa-moped",
  },
];
export const KITCHENDISPLAY = () => {
  const navigate = useNavigate();
  const { order_type } = useParams<Params>();
  const [orderList] = userOrderListByType(order_type!);

  const openKitchenDisplay = (order_type: OrderType) => {
    let url = resolveRoute(KITCHENDISPLAY.route, { order_type });

    navigate(url);
  };

  return (
    <div className="w-full h-full bg-slate-200 flex flex-col">
      <div className="h-[60px] p-3 w-full gap-2 bg-white shadow-lg flex flex-row items-center">
        <ListView
          data={ORDER_BUTTONS}
          render={({ item }) => (
            <Button
              onClick={() => openKitchenDisplay(item.type)}
              size={"lg"}
              className={cn(item.type == order_type && item.activeClassName)}
            >
              <i className={cn("fa-duotone mr-1", item.icon)}></i>
              {item.label}
            </Button>
          )}
        ></ListView>
        <Button
          className="flex ml-auto hover:bg-transparent flex-col items-center font-bold"
          onClick={() => navigate(POS.route)}
          variant={"ghost"}
        >
          <i className="fa-solid fa-power-off text-lg text-red-500"></i>
          Exit
        </Button>
      </div>
      <div className="h-[calc(100%-60px)] w-full grid-cols-4 grid gap-4 p-4 items-start">
        <ListView
          data={orderList}
          render={({ item }) => <MenuCard order={item} />}
        />
      </div>
    </div>
  );
};
KITCHENDISPLAY.route = "/KITCHENDISPLAY/:order_type";
