import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCustomerCount,
  useMonthlyStat,
  useNewOrderCount,
  useTotalMenus,
  useTotalRevinue,
} from "@/hooks/db_query";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { numberFormatter } from "@/lib/utils";

export default function Dashboard() {
  const [newOrderCount] = useNewOrderCount();

  const [customerCount] = useCustomerCount();

  const [totalAmount] = useTotalRevinue();

  const [totalMenus] = useTotalMenus();

  const [monthStat] = useMonthlyStat();

  return (
    <div className="w-full flex flex-row h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="h-full p-3 w-full">
          <div className="flex flex-wrap flex-row w-full justify-between gap-4">
            <Card className="bg-[#ff9e43] flex-1 text-white">
              <CardHeader className="gap-10  w-full justify-between inline-flex flex-row items-center">
                <div>
                  <p className="text-[23px]">{newOrderCount}</p>
                  <p className="text-sm">New Orders</p>
                </div>
                <i className="fa-light text-[27px] fa-memo-circle-check"></i>
              </CardHeader>
            </Card>
            <Card className="bg-[#00d0e7] flex-1 text-white">
              <CardHeader className="gap-10  w-full justify-between inline-flex flex-row items-center">
                <div>
                  <p className="text-[23px]">{customerCount}</p>
                  <p className="text-sm">Customers</p>
                </div>
                <i className="fa-light text-[27px] fa-user-check"></i>
              </CardHeader>
            </Card>
            <Card className="bg-[#1b2950] flex-1 text-white">
              <CardHeader className="gap-10  w-full justify-between inline-flex flex-row items-center">
                <div>
                  <p className="text-[23px]">{totalAmount?.toFixed(2)}</p>
                  <p className="text-sm">Total Amount</p>
                </div>
                <i className="fa-light text-[27px] fa-sterling-sign"></i>
              </CardHeader>
            </Card>
            <Card className="bg-[#28c66f] flex-1 text-white">
              <CardHeader className="gap-10 w-full justify-between inline-flex flex-row items-center">
                <div>
                  <p className="text-[23px]">{totalMenus}</p>
                  <p className="text-sm">Menus</p>
                </div>
                <i className="fa-light text-[27px] fa-pot-food"></i>
              </CardHeader>
            </Card>
          </div>
          <div className="my-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width={"100%"} height={350}>
                  <LineChart data={monthStat}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        `${numberFormatter.format(value)}`
                      }
                    />
                    <Tooltip />
                    <Line dataKey="total" fill="#28c66f" type={"bump"} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}

Dashboard.route = "/Dashboard";
