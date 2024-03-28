import { FILTERSHEET } from "@/components/terminal/FILTERSHEET";
import { NOTEDIALOG } from "@/components/terminal/NOTEDIALOG";
import { ORDERDIALOG } from "@/components/terminal/ORDERDIALOG";
import { ORDERHISTORY } from "@/components/terminal/ORDERHOSTORY";
import { PAYMENTDIALOG } from "@/components/terminal/PAYMENTDIALOG";
import { SETTINGSSHEET } from "@/components/terminal/SETTINGSSHEET";
import { TABLEDIALOG } from "@/components/terminal/TABLEDIALOG";
import { Button } from "@/components/ui/button";
import { ScrollBar } from "@/components/ui/scroll-area";
import { ListView } from "@/components/utility/ListView";
import CategoryBox from "@/components/widget/category";
import ProductBox, { OrderProductBox } from "@/components/widget/product";
import { db } from "@/db";
import { OrderProduct, OrderType } from "@/db/index.type";
import {
  useCategoryList,
  useCustomer,
  usePrinterList,
  useProductList,
} from "@/hooks/db_query";
import { cn, groupBy, numberFormatter, resolveRoute } from "@/lib/utils";
import { useAuthUserStore } from "@/stores/auth";
import { getOrderStoreSnapShot, useOrderStore } from "@/stores/order.store";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { print } from "tauri-plugin-printer";
import POS from "./pos";
import { NOTIFICATIONCENTER } from "@/functions/NotificationCenter";
import { CALLCENTER } from "@/functions/CALLCENTER";
export type Parameter = {
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

export default function Terminal() {
  NOTIFICATIONCENTER.useNotificationHandler();

  const { order_type } = useParams<Parameter>();
  const [user] = useAuthUserStore();
  const [config, setConfig] = React.useState({
    name: "",
    modified: Date.now(),
    phone: "",
    email: "",
    address: "",
    _id: "config/_general",
    description: "",
  });

  const [printers] = usePrinterList();

  const [customerList] = useCustomer();

  const {
    order_items: items,
    resetState,
    tables,
    customer_id: customer,
    _id,
  } = useOrderStore();
  const [categories] = useCategoryList();

  const [category, setCategory] = React.useState("");

  const [filter, setFilter] = React.useState<string[]>([]);

  const query = React.useMemo(() => {
    if (category && filter.length) {
      return { category_id: category, filter: { $all: filter } };
    }
    if (filter.length) {
      return { filter: { $all: filter } };
    }
    if (category) {
      return { category_id: category };
    }
  }, [category, filter]);

  const [products] = useProductList(query);

  const navigate = useNavigate();

  const openTerminal = (order_type: OrderType) => {
    let url = resolveRoute(Terminal.route, { order_type });

    navigate(url);
  };

  const subtotal = items.reduce(
    (prev, item) => prev + item.subtotal + item.modifier_cost,
    0
  );
  const tax = items.reduce((prev, item) => prev + item.tax, 0);

  const discount = items.reduce((prev, item) => prev + item.discount, 0);

  const grandTotal = items.reduce((prev, item) => prev + item.total, 0);

  const handleSave = async () => {
    if (grandTotal == 0) {
      toast.error("Please Select Items");
      return;
    }
    let orderData = getOrderStoreSnapShot();
    orderData.amount = grandTotal;
    orderData.total_discount = discount;
    orderData.total_tax = tax;

    await db.put(orderData);
    toast.success("Order Submitted!");
    resetState();
  };

  const handleKitchenRePrint = async () => {
    if (grandTotal === 0) {
      toast.error("Please select items");
      return;
    }
    // let customerData = customerList?.find((item) => item._id == customer);
    let order_id = _id;
    let orderProductsGroup = groupBy(
      items,
      (item) => item.product.department?.name
    );
    let itemList = Object.keys(orderProductsGroup).map((department) => {
      let itemsInDept = orderProductsGroup[department];
      return [
        {
          type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
          value: department,
          style: {
            fontSize: "17px",
            textAlign: "center",
            fontFamily: "monospace",
            fontWeight: "bold",
            marginBlock: "20px",
          },
        },
        {
          type: "table",
          // style the table
          style: {
            width: "100%",
            fontFamily: "monospace",
            fontSize: 15,
          },
          // list of the columns to be rendered in the table header
          // multi dimensional array depicting the rows and columns of the table body
          /*
            ${orderProduct.product[
                `${order_type!}_price`
              ].toFixed(2)} X ${orderProduct.count} + ${
                orderProduct.modifier_cost
              }
          */
          tableBody: [
            ...itemsInDept.map((orderProduct: OrderProduct) => [
              `<div style="display: flex; flex-direction: column;width: 90px; font-size: 15px; font-weight: 500">
                <span style="font-size:15px;font-weight:600;">${
                  orderProduct.count
                } ${orderProduct.product.name}</span>
                <span style="font-size:15px;font-weight:600;">${
                  orderProduct.modifier.length
                    ? "Modifier: " +
                      orderProduct.modifier.map((item) => item.name).join("")
                    : ""
                }</span>
                <span style="font-size:15px;font-weight:600;">${
                  orderProduct.remove_instruction.length
                    ? "Remove Instruction: " +
                      orderProduct.remove_instruction
                        .map((item) => item.name)
                        .join(", ")
                    : ""
                }</span>
              </div>`,
              `<span style="overflow:hidden; display: block; text-align: center;width: 70px;"></span>`,
              `<span style="width: 80px; display: block; text-align: right; font-size: 15px; font-weight: 600">${(
                orderProduct.subtotal + orderProduct.modifier_cost
              ).toFixed(2)}</span>`,
            ]),
          ],
          // list of columns to be rendered in the table footer
        },
      ];
    });
    const data = [
      ...itemList.flat(),
      {
        type: "table",
        // style the table
        style: {
          width: "100%",
          marginTop: "40px",
          fontFamily: "monospace",
          fontSize: 15,
        },
        // list of the columns to be rendered in the table header
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
          [
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: left;">SubTotal</span>`,
            `<span style="font-weight: bold; font-size: 16px; display: block; text-align: center;"></span>`,
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: right;">${subtotal.toFixed(
              2
            )}</span>`,
          ],
          [
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: left;">Tax</span>`,
            `<span style="font-weight: bold; font-size: 16px; display: block; text-align: center;"></span>`,
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: right;">${tax.toFixed(
              2
            )}</span>`,
          ],
          [
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align:left;">Discount</span>`,
            `<span style="font-weight: bold; font-size: 16px; display: block;"></span>`,
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: right;">${discount.toFixed(
              2
            )}</span>`,
          ],
          [
            `<span style="font-weight: bold; font-size: 18px;display: block;width: 80px;">Grand Total</span>`,
            `<span style="font-weight: bold; font-size: 16px;display: block;width: 80px;"></span>`,
            `<span style="font-weight: bold; font-size: 18px;display: block;width: 80px;text-align: right;">${grandTotal.toFixed(
              2
            )}</span>`,
          ],
        ],
        // list of columns to be rendered in the table footer
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `ORDER ID: ${order_id}`,
        style: {
          fontSize: "17px",
          fontFamily: "monospace",
          fontWeight: "bold",
          marginTop: "20px",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `ORDER BY: ${user?.name}`,
        style: {
          fontSize: "16px",
          fontFamily: "monospace",
          fontWeight: "bold",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `ORDER TYPE ${order_type}`,
        style: {
          fontSize: "16px",
          fontFamily: "monospace",
          fontWeight: "bold",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value:
          OrderType.DINE_IN == order_type
            ? `TABLE: ${tables.map((item) => item.name).join(", ")}`
            : "",
        style: {
          fontSize: "16px",
          fontFamily: "monospace",
          fontWeight: "bold",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `TIMESTAMP: ${new Date().toLocaleString()}`,
        style: {
          fontSize: "14px",
          fontFamily: "monospace",
        },
      },
    ];
    for (let i = 0; i < items.length; i++) {
      let orderProduct = items[i];
      let device_name =
        printers?.find(
          (item) => item._id == orderProduct.product.department?.printer_id
        )?.device_name ?? "";
      try {
        let response = await print(data as any, {
          preview: i == 0,
          name: device_name,
          page_size: {
            width: 302,
            height: 1000,
          },
          print_setting: {
            orientation: "portrait",
            method: "simplex", // duplex | simplex | duplexshort
            paper: "A4", // "A2" | "A3" | "A4" | "A5" | "A6" | "letter" | "legal" | "tabloid"
            scale: "fit", //"noscale" | "shrink" | "fit"
            repeat: 1, // total copies,
            // range: "1,2,3"    // print page 1,2,3
          },
          remove_temp: true,
        });
        toast.success(response.message ?? "Print Done!");
      } catch {
        toast.error("Error while print error");
      }
    }
  };
  const handleKitchenPrint = async () => {
    if (grandTotal === 0) {
      toast.error("Please select items");
      return;
    }
    // let customerData = customerList?.find((item) => item._id == customer);
    let order_id = _id;
    let orderProductsGroup = groupBy(
      items.filter((item) => !item.completed),
      (item) => item.product.department?.name
    );
    let itemList = Object.keys(orderProductsGroup).map((department) => {
      let itemsInDept = orderProductsGroup[department];
      return [
        {
          type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
          value: department,
          style: {
            fontSize: "17px",
            textAlign: "center",
            fontFamily: "monospace",
            fontWeight: "bold",
            marginBlock: "20px",
          },
        },
        {
          type: "table",
          // style the table
          style: {
            width: "100%",
            fontFamily: "monospace",
            fontSize: 15,
          },
          // list of the columns to be rendered in the table header
          // multi dimensional array depicting the rows and columns of the table body
          /*
            ${orderProduct.product[
                `${order_type!}_price`
              ].toFixed(2)} X ${orderProduct.count} + ${
                orderProduct.modifier_cost
              }
          */
          tableBody: [
            ...itemsInDept.map((orderProduct: OrderProduct) => [
              `<div style="display: flex; flex-direction: column;width: 90px; font-size: 15px; font-weight: 500">
                <span style="font-size:15px;font-weight:600;">${
                  orderProduct.count
                } ${orderProduct.product.name}</span>
                <span style="font-size:15px;font-weight:600;">${
                  orderProduct.modifier.length
                    ? "Modifier: " +
                      orderProduct.modifier.map((item) => item.name).join("")
                    : ""
                }</span>
                <span style="font-size:15px;font-weight:600;">${
                  orderProduct.remove_instruction.length
                    ? "Remove Instruction: " +
                      orderProduct.remove_instruction
                        .map((item) => item.name)
                        .join(", ")
                    : ""
                }</span>
              </div>`,
              `<span style="overflow:hidden; display: block; text-align: center;width: 70px;"></span>`,
              `<span style="width: 80px; display: block; text-align: right; font-size: 15px; font-weight: 600">${(
                orderProduct.subtotal + orderProduct.modifier_cost
              ).toFixed(2)}</span>`,
            ]),
          ],
          // list of columns to be rendered in the table footer
        },
      ];
    });
    const data = [
      ...itemList.flat(),
      {
        type: "table",
        // style the table
        style: {
          width: "100%",
          marginTop: "40px",
          fontFamily: "monospace",
          fontSize: 15,
        },
        // list of the columns to be rendered in the table header
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
          [
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: left;">SubTotal</span>`,
            `<span style="font-weight: bold; font-size: 16px; display: block; text-align: center;"></span>`,
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: right;">${subtotal.toFixed(
              2
            )}</span>`,
          ],
          [
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: left;">Tax</span>`,
            `<span style="font-weight: bold; font-size: 16px; display: block; text-align: center;"></span>`,
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: right;">${tax.toFixed(
              2
            )}</span>`,
          ],
          [
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align:left;">Discount</span>`,
            `<span style="font-weight: bold; font-size: 16px; display: block;"></span>`,
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: right;">${discount.toFixed(
              2
            )}</span>`,
          ],
          [
            `<span style="font-weight: bold; font-size: 18px;display: block;width: 80px;">Grand Total</span>`,
            `<span style="font-weight: bold; font-size: 16px;display: block;width: 80px;"></span>`,
            `<span style="font-weight: bold; font-size: 18px;display: block;width: 80px;text-align: right;">${grandTotal.toFixed(
              2
            )}</span>`,
          ],
        ],
        // list of columns to be rendered in the table footer
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `ORDER ID: ${order_id}`,
        style: {
          fontSize: "17px",
          fontFamily: "monospace",
          fontWeight: "bold",
          marginTop: "20px",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `ORDER BY: ${user?.name}`,
        style: {
          fontSize: "16px",
          fontFamily: "monospace",
          fontWeight: "bold",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `ORDER TYPE ${order_type}`,
        style: {
          fontSize: "16px",
          fontFamily: "monospace",
          fontWeight: "bold",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value:
          OrderType.DINE_IN == order_type
            ? `TABLE: ${tables.map((item) => item.name).join(", ")}`
            : "",
        style: {
          fontSize: "16px",
          fontFamily: "monospace",
          fontWeight: "bold",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `TIMESTAMP: ${new Date().toLocaleString()}`,
        style: {
          fontSize: "14px",
          fontFamily: "monospace",
        },
      },
    ];
    for (let i = 0; i < items.length; i++) {
      let orderProduct = items[i];
      let device_name =
        printers?.find(
          (item) => item._id == orderProduct.product.department?.printer_id
        )?.device_name ?? "";
      try {
        let response = await print(data as any, {
          preview: i == 0,
          name: device_name,
          page_size: {
            width: 302,
            height: 1000,
          },
          print_setting: {
            orientation: "portrait",
            method: "simplex", // duplex | simplex | duplexshort
            paper: "A4", // "A2" | "A3" | "A4" | "A5" | "A6" | "letter" | "legal" | "tabloid"
            scale: "fit", //"noscale" | "shrink" | "fit"
            repeat: 1, // total copies,
            // range: "1,2,3"    // print page 1,2,3
          },
          remove_temp: true,
        });
        toast.success(response.message ?? "Print Done!");
      } catch {
        toast.error("Error while print error");
      }
    }
  };
  const handlePrint = async () => {
    if (grandTotal === 0) {
      toast.error("Please select items");
      return;
    }
    let customerData = customerList?.find((item) => item._id == customer);
    let order_id = _id;
    let orderProductsGroup = groupBy(
      items,
      (item) => item.product.department?.name
    );
    let itemList = Object.keys(orderProductsGroup).map((department) => {
      let itemsInDept = orderProductsGroup[department];
      return [
        {
          type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
          value: department,
          style: {
            fontSize: "17px",
            textAlign: "center",
            fontFamily: "monospace",
            fontWeight: "bold",
            marginBlock: "20px",
          },
        },
        {
          type: "table",
          // style the table
          style: {
            width: "100%",
            fontFamily: "monospace",
            fontSize: 15,
          },
          // list of the columns to be rendered in the table header
          // multi dimensional array depicting the rows and columns of the table body
          /*
            ${orderProduct.product[
                `${order_type!}_price`
              ].toFixed(2)} X ${orderProduct.count} + ${
                orderProduct.modifier_cost
              }
          */
          tableBody: [
            ...itemsInDept.map((orderProduct: OrderProduct) => [
              `<div style="display: flex; flex-direction: column; gap: 8px;width: 80px; font-size: 15px; font-weight: 500">
                <span style="font-size:14px;font-weight:bold;">${orderProduct.product.name}</span>
              </div>`,
              `<span style="overflow:hidden; display: block; text-align: center;width: 80px;"></span>`,
              `<span style="width: 80px; display: block; text-align: right; font-size: 17px; font-weight: 600">${(
                orderProduct.subtotal + orderProduct.modifier_cost
              ).toFixed(2)}</span>`,
            ]),
          ],
          // list of columns to be rendered in the table footer
        },
      ];
    });
    const data = [
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: config.name,
        style: {
          fontWeight: "700",
          textAlign: "center",
          fontSize: "20px",
          fontFamily: "monospace",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `TEL: ${config.phone}`,
        style: {
          fontSize: "14px",
          textAlign: "center",
          fontFamily: "monospace",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `${config.address}`,
        style: {
          fontSize: "14px",
          textAlign: "center",
          fontFamily: "monospace",
        },
      },
      {
        type: "barCode",
        value: order_id,
        height: 40, // height of barcode, applicable only to bar and QR codes
        width: 2, // width of barcode, applicable only to bar and QR codes
        displayValue: true, // Display value below barcode
        fontsize: 12,
        style: {
          marginBottom: 20,
        },
      },
      ...itemList.flat(),
      {
        type: "table",
        // style the table
        style: {
          width: "100%",
          marginTop: "40px",
          fontFamily: "monospace",
          fontSize: 15,
        },
        // list of the columns to be rendered in the table header
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
          [
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: left;">SubTotal</span>`,
            `<span style="font-weight: bold; font-size: 16px; display: block; text-align: center;"></span>`,
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: right;">${subtotal.toFixed(
              2
            )}</span>`,
          ],
          [
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: left;">Tax</span>`,
            `<span style="font-weight: bold; font-size: 16px; display: block; text-align: center;"></span>`,
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: right;">${tax.toFixed(
              2
            )}</span>`,
          ],
          [
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align:left;">Discount</span>`,
            `<span style="font-weight: bold; font-size: 16px; display: block;"></span>`,
            `<span style="font-weight: bold; font-size: 16px; width: 80px; display: block; text-align: right;">${discount.toFixed(
              2
            )}</span>`,
          ],
          [
            `<span style="font-weight: bold; font-size: 18px;display: block;width: 80px;">Grand Total</span>`,
            `<span style="font-weight: bold; font-size: 16px;display: block;width: 80px;"></span>`,
            `<span style="font-weight: bold; font-size: 18px;display: block;width: 80px;text-align: right;">${grandTotal.toFixed(
              2
            )}</span>`,
          ],
        ],
        // list of columns to be rendered in the table footer
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `ORDER ID: ${order_id}`,
        style: {
          fontSize: "17px",
          fontFamily: "monospace",
          fontWeight: "bold",
          marginTop: "20px",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `TO: ${customerData?.name}`,
        style: {
          fontSize: "15px",
          fontFamily: "monospace",
          fontWeight: "bold",
          marginTop: "20px",
          borderTop: "1px dashed black",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `ADDRESS: ${customerData?.address}`,
        style: {
          fontSize: "15px",
          fontFamily: "monospace",
          fontWeight: "bold",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `PHONE: ${customerData?.phone}`,
        style: {
          fontSize: "15px",
          fontFamily: "monospace",
          fontWeight: "bold",
          marginBottom: "20px",
          borderBottom: "1px dashed black",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `ORDER BY: ${user?.name}`,
        style: {
          fontSize: "14px",
          fontFamily: "monospace",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `ORDER TYPE ${order_type}`,
        style: {
          fontSize: "14px",
          fontFamily: "monospace",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value:
          OrderType.DINE_IN == order_type
            ? `TABLE: ${tables.map((item) => item.name).join(", ")}`
            : "",
        style: {
          fontSize: "14px",
          fontFamily: "monospace",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `TIMESTAMP: ${new Date().toLocaleString()}`,
        style: {
          fontSize: "14px",
          fontFamily: "monospace",
        },
      },
    ];
    for (let i = 0; i < items.length; i++) {
      let orderProduct = items[i];
      let device_name =
        printers?.find(
          (item) => item._id == orderProduct.product.department?.printer_id
        )?.device_name ?? "";
      try {
        let response = await print(data as any, {
          preview: i == 0,
          name: device_name,
          page_size: {
            width: 302,
            height: 1000,
          },
          print_setting: {
            orientation: "portrait",
            method: "simplex", // duplex | simplex | duplexshort
            paper: "A4", // "A2" | "A3" | "A4" | "A5" | "A6" | "letter" | "legal" | "tabloid"
            scale: "fit", //"noscale" | "shrink" | "fit"
            repeat: 1, // total copies,
            // range: "1,2,3"    // print page 1,2,3
          },
          remove_temp: true,
        });
        toast.success(response.message ?? "Print Done!");
      } catch {
        toast.error("Error while print error");
      }
    }
  };
  React.useEffect(() => {
    (async () => {
      let data = await db.get("config/_general");
      setConfig(data as any);
      CALLCENTER.useCallHandler();
    })();
  }, []);

  return (
    <div className="w-full h-full bg-slate-200 flex flex-col">
      <div className="w-full h-[60px] flex-shrink-0 bg-white shadow-lg flex flex-row justify-between items-center p-3">
        <div className="flex flex-row gap-4">
          <ListView
            data={ORDER_BUTTONS}
            render={({ item }) => (
              <Button
                onClick={() => openTerminal(item.type)}
                size={"lg"}
                className={cn(item.type == order_type && item.activeClassName)}
              >
                <i className={cn("fa-duotone mr-1", item.icon)}></i>
                {item.label}
              </Button>
            )}
          ></ListView>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Button
            className="flex hover:bg-transparent flex-col items-center font-bold"
            onClick={() => navigate(POS.route)}
            variant={"ghost"}
          >
            <i className="fa-solid fa-power-off text-lg text-red-500"></i>
            Exit
          </Button>
        </div>
      </div>
      <div className="w-full min-h-[50px] bg-gray-100 shadow-lg flex flex-row justify-between items-center p-3">
        <div className="flex flex-row flex-wrap gap-4 items-center">
          <ORDERDIALOG />
          <TABLEDIALOG />
          <FILTERSHEET filters={filter} setFilter={setFilter} />
          <NOTEDIALOG />
          <PAYMENTDIALOG handleKitchenPrint={handleKitchenPrint} />
          <Button onClick={handlePrint} className="font-bold" variant="ghost">
            <i className="fa-solid fa-print text-orange-500 text-lg mr-1"></i>
            Print Bill
          </Button>
          <Button
            onClick={handleKitchenPrint}
            className="font-bold"
            variant="ghost"
          >
            <i className="fa-solid fa-print text-cyan-500 text-lg mr-1"></i>
            Print Kitchen Bill
          </Button>
          <Button
            onClick={handleKitchenRePrint}
            className="font-bold"
            variant="ghost"
          >
            <i className="fa-solid fa-print text-violet-500 text-lg mr-1"></i>
            Re-print Bill
          </Button>
          <Button onClick={handleSave} className="font-bold" variant="ghost">
            <i className="fa-solid fa-save text-green-500 text-lg mr-1"></i>
            Save
          </Button>
          <ORDERHISTORY />
          <Button
            onClick={() => resetState()}
            className="font-bold"
            variant="ghost"
          >
            <i className="fa-solid fa-times-circle text-red-500 text-lg mr-1"></i>
            Reset
          </Button>
          <SETTINGSSHEET />
        </div>
      </div>
      <div className="w-full flex-grow h-[calc(100%-160px)] flex flex-row">
        <ScrollArea className="h-full w-[100px] p-2">
          <ListView
            data={categories}
            render={({ item }) => (
              <CategoryBox
                order_type={order_type!}
                onClick={() => setCategory(item._id)}
                category={item}
              />
            )}
          />
          <ScrollBar />
        </ScrollArea>
        <ScrollArea className="h-full w-[calc(100%-450px)] p-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <ListView
            data={products}
            render={({ item }) => <ProductBox product={item} />}
          ></ListView>
          <ScrollBar />
        </ScrollArea>
        <div className="w-[350px] flex flex-col h-full bg-slate-100 shadow-md">
          <div className="h-[calc(100%-210px)] flex flex-col overflow-auto">
            <ListView
              data={items}
              render={({ item, index }) => (
                <OrderProductBox tabIndex={index} item={item} />
              )}
            />
            {items.length == 0 && (
              <div className="flex my-auto text-indigo-300 flex-col items-center justify-center">
                <i className="fa-solid fa-cart-circle-xmark text-[40px]"></i>
                <span>No Items</span>
              </div>
            )}
          </div>
          <div className="w-full h-[210px] bg-slate-100 p-3 mt-auto">
            <div className="p-3 flex flex-row items-center justify-between">
              <span>Sub Total</span>
              <span>{numberFormatter.format(subtotal)}</span>
            </div>
            <div className="p-3 flex flex-row items-center justify-between">
              <span>Tax</span>
              <span>{numberFormatter.format(tax)}</span>
            </div>
            <div className="p-3 flex flex-row items-center justify-between">
              <span>Discount</span>
              <span>{numberFormatter.format(discount)}</span>
            </div>
            <div className="p-3 flex flex-row items-center justify-between">
              <span>Grand Total</span>
              <span className="text-[23px] font-semibold">
                {numberFormatter.format(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Terminal.route = "/Terminal/:order_type";
