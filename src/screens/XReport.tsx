import DashboardNavbar from "@/components/DashboardNavbar";
import { SidebarComponent } from "@/components/SidebarComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import { ScrollBar } from "@/components/ui/scroll-area";
import { ListView } from "@/components/utility/ListView";
import {
  useGeneralSettings,
  useOrderHistory,
  useTotalRevinue,
} from "@/hooks/db_query";
import {
  aggregateDocuments,
  aggregatePaymentMethods,
  flatChildArray,
  numberFormatter,
} from "@/lib/utils";
import React from "react";

export default function XReport() {
  const [settings] = useGeneralSettings();
  const [totalAmount] = useTotalRevinue();
  const [orderHistory] = useOrderHistory([]);

  const paymentSells = React.useMemo(
    () => aggregatePaymentMethods(orderHistory ?? []),
    [orderHistory]
  );

  const orderTypeSell = React.useMemo(
    () => aggregateDocuments(orderHistory ?? [], "order_type", "amount"),
    [orderHistory]
  );

  const discountAmount = React.useMemo(
    () => orderHistory?.reduce((prev, curr) => prev + curr.total_discount, 0),
    [orderHistory]
  );

  const taxAmount = React.useMemo(
    () => orderHistory?.reduce((prev, curr) => prev + curr.total_tax, 0),
    [orderHistory]
  );
  const categorySells = flatChildArray(orderHistory ?? [], "")

  return (
    <div className="w-full flex h-full bg-gray-200">
      <SidebarComponent />
      <div className="h-full flex flex-col w-full">
        <DashboardNavbar />
        <ScrollArea className="mt-5 flex p-3">
          <Card className="max-w-[300px] rounded-none shadow-none w-full mx-auto">
            <CardHeader className="border-b border-b-gray-300 mb-3">
              <CardTitle className="text-lg">X Report</CardTitle>
              <CardDescription>{new Date().toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-3 flex-row items-center">
                <p className="font-bold mr-1">Business Name: </p>
                <p>{settings?.name}</p>
              </div>
              <div className="flex mb-3 flex-row items-center">
                <p className="font-bold mr-1">Address: </p>
                <p>{settings?.address}</p>
              </div>
              <hr />
              <CardTitle className="text-lg mb-3">Sales Report</CardTitle>
              <div className="flex mb-3 flex-row items-center">
                <p className="font-bold mr-1">Total Sales: </p>
                <p>{numberFormatter.format(totalAmount ?? 0)}</p>
              </div>
              <div className="flex mb-3 flex-row items-center">
                <p className="font-bold mr-1">Total Transactions: </p>
                <p>{orderHistory?.length}</p>
              </div>
              <div className="flex mb-3 flex-row items-center">
                <p className="font-bold mr-1">Average Transaction amount: </p>
                <p>
                  {numberFormatter.format(
                    (totalAmount ?? 0) / (orderHistory?.length ?? 1)
                  )}
                </p>
              </div>
              <div className="flex mb-3 flex-row items-center">
                <p className="font-bold mr-1">Total Discount: </p>
                <p>{numberFormatter.format(discountAmount ?? 0)}</p>
              </div>
              <CardTitle className="text-lg mb-3">Tax Summary</CardTitle>
              <div className="flex mb-3 flex-row items-center">
                <p className="font-bold mr-1">Total Tax: </p>
                <p>{numberFormatter.format(taxAmount ?? 0)}</p>
              </div>
              <CardTitle className="text-lg mb-3">Payment Methods</CardTitle>
              <ListView
                data={Object.keys(paymentSells ?? {})}
                render={(item) => (
                  <div className="flex mb-3 flex-row items-center">
                    <p className="font-bold mr-1">
                      {item.item.replace("_", " ").toUpperCase()}:{" "}
                    </p>
                    <p>
                      {numberFormatter.format(paymentSells?.[item.item] ?? 0)}
                    </p>
                  </div>
                )}
              ></ListView>
              <CardTitle className="text-lg mb-3">Order Types</CardTitle>
              <ListView
                data={Object.keys(orderTypeSell ?? {})}
                render={(item) => (
                  <div className="flex mb-3 flex-row items-center">
                    <p className="font-bold mr-1">
                      {item.item.replace("_", " ").toUpperCase()}:{" "}
                    </p>
                    <p>
                      {numberFormatter.format(orderTypeSell?.[item.item] ?? 0)}
                    </p>
                  </div>
                )}
              ></ListView>
            </CardContent>
          </Card>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}

XReport.route = "/XReport";
