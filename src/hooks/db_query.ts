import { db } from "@/db";
import {
  Allergen,
  Area,
  Booking,
  CALL,
  Category,
  Config,
  Coupon,
  CouponSell,
  Customer,
  CustomerType,
  DBCollections,
  Department,
  Discount,
  Expense,
  ExpenseType,
  FAQ,
  Filter,
  FilterAttribute,
  GeneralSetting,
  Ingredient,
  Modifier,
  ModifierGroup,
  NOTIFICATION,
  NOTIFICATIONSTATUS,
  Order,
  OrderStatus,
  OrderType,
  PaymentMethods,
  Printer,
  Product,
  RemoveInstruction,
  Subscriber,
  Table,
  Testimonial,
} from "@/db/index.type";
import usePouchDB from "./usePouchDB";
import { aggregatePaymentMethods, fetchRelationShip } from "@/lib/utils";

export const useNewOrderCount = () =>
  usePouchDB(async () => {
    let response = await db.find({
      selector: {
        table: DBCollections.ORDER,
        status: 0,
      },
    });

    return response.docs.length;
  }, []);

export const useCustomerCount = () =>
  usePouchDB(async () => {
    let response = await db.find({
      selector: {
        table: DBCollections.CUSTOMER,
        status: 0,
      },
    });

    return response.docs.length;
  }, []);

export const useTotalRevinue = () =>
  usePouchDB(async () => {
    let query = {
      map: function (doc: Order, emit: any) {
        if (doc.table == "orders" && doc.status == 1) {
          emit("", doc.amount);
        }
      },
      reduce: function reduceFunction(_keys: any, values: any, _rereduce: any) {
        return values.reduce(function (acc: number, val: number) {
          return acc + val;
        }, 0);
      },
    };

    let result = await db.query(query, {
      reduce: true,
    });

    return result.rows.at(0)?.value ?? 0;
  }, []);

export const useTotalMenus = () =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.ITEM,
      },
    });

    return result.docs.length;
  }, []);

export const useMonthlyStat = () =>
  usePouchDB(async () => {
    const data = [
      {
        name: "Jan",
        total: 0,
      },
      {
        name: "Feb",
        total: 0,
      },
      {
        name: "Mar",
        total: 0,
      },
      {
        name: "Apr",
        total: 0,
      },
      {
        name: "May",
        total: 0,
      },
      {
        name: "Jun",
        total: 0,
      },
      {
        name: "Jul",
        total: 0,
      },
      {
        name: "Aug",
        total: 0,
      },
      {
        name: "Sep",
        total: 0,
      },
      {
        name: "Oct",
        total: 0,
      },
      {
        name: "Nov",
        total: 0,
      },
      {
        name: "Dec",
        total: 0,
      },
    ];
    let query = {
      map: function (doc: Order, emit: any) {
        if (
          doc.table == "orders" &&
          doc.status == 1 &&
          new Date(doc.modified).getFullYear() == new Date().getFullYear()
        ) {
          emit(new Date(doc.modified).getMonth(), doc.amount);
        }
      },
      reduce: function reduceFunction(_keys: any, values: any, _rereduce: any) {
        return values.reduce(function (acc: number, val: number) {
          return acc + val;
        }, 0);
      },
    };
    let result = await db.query(query, {
      group: true,
    });

    result.rows.forEach((row) => {
      data[row.key].total = row.value;
    });

    return data;
  }, []);
export const userOrderListByType = (order_type: OrderType) =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.ORDER,
        order_type,
        status: {
          $ne: OrderStatus.SUCCESS,
        },
      },
      sort: [{ _id: "desc" }],
    });

    return result.docs as Order[];
  }, [order_type]);
export const useOrderHistory = (deps: any[]) =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.ORDER,
      },
      sort: [{ _id: "desc" }],
    });

    return result.docs as Order[];
  }, deps);

export const useOrderHistoryCount = (deps: any[]) =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.ORDER,
      },
    });
    return result.docs.length;
  }, deps);

export const useCustomer = () =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.CUSTOMER,
      },
    });

    return (result.docs ?? []) as Customer[];
  }, []);

export const useConfigInfo = () =>
  usePouchDB(async () => {
    let result = await db.get("config/_tax");

    return result as Config;
  }, []);
export const useCategoryList = () =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.CATEGORY,
      },
    });

    return result.docs as Category[];
  }, []);
export const useIngredientList = () =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.INGREDIENT,
      },
    });

    return result.docs as Ingredient[];
  }, []);

export const useAllergenList = () =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.ALLERGENS,
      },
    });

    return result.docs as Allergen[];
  }, []);
export const useRemoveList = () =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.REMOVE,
      },
    });

    return result.docs as RemoveInstruction[];
  }, []);

export const useModifierGroups = () =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.MODIFIER_GROUP,
      },
    });

    return result.docs as ModifierGroup[];
  }, []);

export const useModifier = () =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.MODIFIER,
      },
    });

    return result.docs as Modifier[];
  }, []);

export const useFilterAttribute = (fetchFilter?: true | undefined) =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.FILTER_ATTRIBUTE,
        },
      })
    ).docs as FilterAttribute[];

    if (!fetchFilter) return result;

    for (let filterAttribute of result) {
      filterAttribute.filters = (
        await db.find({
          selector: {
            table: DBCollections.FILTER,
            filter_attribute_id: filterAttribute._id,
          },
        })
      ).docs as Filter[];
    }

    return result;
  }, []);
export const useFilters = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.FILTER,
        },
      })
    ).docs as Filter[];

    return await fetchRelationShip(["filter_attribute_id"], result);
  }, []);
export const usePrinterList = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.PRINTER,
        },
      })
    ).docs as Printer[];

    return result;
  }, []);
export const useDepartmentList = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.DEPTS,
        },
      })
    ).docs as Department[];

    return await fetchRelationShip(["printer_id"], result);
  }, []);
export const useExpenseType = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.EXPENSE_TYPE,
        },
      })
    ).docs as ExpenseType[];

    return result;
  }, []);

export const useExpenses = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.EXPENSE,
        },
      })
    ).docs as Expense[];

    return await fetchRelationShip(["expense_type_id"], result);
  }, []);

export const useAreaList = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.AREA,
        },
      })
    ).docs as Area[];

    return result;
  }, []);

export const useTableList = (area_id = "") =>
  usePouchDB(async () => {
    let result = (
      area_id == ""
        ? await db.find({
            selector: {
              table: DBCollections.TABLE,
            },
          })
        : await db.find({
            selector: {
              table: DBCollections.TABLE,
              area_id,
            },
          })
    ).docs as Table[];

    for (let table of result) {
      table.status = 0;
      let orders = await db.find({
        selector: {
          table: DBCollections.ORDER,
          status: 3,
          tables: {
            $elemMatch: {
              $eq: table._id,
            },
          },
        },
      });

      let bookings = await db.find({
        selector: {
          table: DBCollections.BOOKING,
          status: 0,
          tables: {
            $elemMatch: {
              $eq: table._id,
            },
          },
          datetime: {
            $lt: Date.now(),
          },
        },
      });

      table.orders = orders.docs as Order[];

      table.bookings = bookings.docs as Booking[];

      if (table.orders?.length >= 1) {
        table.status = 1;
        table.status_message = `Serving for ${
          table.orders.at(0)?.customer_name
        }`;
      }
      if (table.bookings?.length >= 1) {
        table.status = 2;
        table.status_message = `Reserved for ${
          table.bookings.at(0)?.customer_name
        }`;
      }
    }

    return await fetchRelationShip(["area_id"], result);
  }, [area_id]);

export const useBookingList = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.BOOKING,
        },
      })
    ).docs as Booking[];

    for (let booking of result) {
      booking.tableData = await Promise.all(
        booking.tables.map(async (item) => await db.get(item))
      );
    }

    return result;
  }, []);
export const useCustomerTypes = () =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.CUSTOMER_TYPE,
      },
    });

    return result.docs as CustomerType[];
  }, []);
export const useCustomers = () =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.CUSTOMER,
      },
    });

    return result.docs as Customer[];
  }, []);
export const useTestimonials = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.TESTIMONIAL,
        },
      })
    ).docs as Testimonial[];

    return result;
  }, []);
export const useFaqList = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.FAQ,
        },
      })
    ).docs as FAQ[];

    return result;
  }, []);
export const useSubscribers = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.SUBSCRIBER,
        },
      })
    ).docs as Subscriber[];

    return result;
  }, []);
export const useDiscounts = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.DISCOUNT,
        },
      })
    ).docs as Discount[];

    return result;
  }, []);

export const useProductList = (query: any) =>
  usePouchDB(async () => {
    let result = (await db.find({
      selector: {
        table: DBCollections.ITEM,
        ...query,
      },
    })) as PouchDB.Find.FindResponse<Product>;

    return fetchRelationShip(["category_id", "department_id"], result.docs);
  }, [query]);

export const useCoupons = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.COUPON,
        },
      })
    ).docs as Coupon[];

    return result;
  }, []);
export const usePaymentMethods = () =>
  usePouchDB(async () => {
    let result = (
      await db.find({
        selector: {
          table: DBCollections.PAYMENT_METHODS,
        },
      })
    ).docs as PaymentMethods[];

    return result;
  }, []);
export const useCouponSells = () =>
  usePouchDB(async () => {
    let result = (await db.find({
      selector: {
        table: DBCollections.COUPON_SELL,
      },
    })) as PouchDB.Find.FindResponse<CouponSell>;

    return fetchRelationShip(["coupon_id", "customer_id"], result.docs);
  }, []);
export const useTerminalNotification = () =>
  usePouchDB(async () => {
    let result = (await db.find({
      selector: {
        table: DBCollections.NOTIFICATION,
        status: NOTIFICATIONSTATUS.PENDING,
      },
    })) as PouchDB.Find.FindResponse<NOTIFICATION>;
    return result.docs;
  }, []);
export const useCallList = (user_id: string) => {
  return usePouchDB(async () => {
    let result = (await db.find({
      selector: {
        table: DBCollections.CALLS,
        user_id,
      },
    })) as PouchDB.Find.FindResponse<CALL>;
    return result.docs;
  }, [user_id]);
};

export const useGeneralSettings = () =>
  usePouchDB(
    async () => (await db.get("config/_general")) as GeneralSetting,
    []
  );
export const usePaymentMethodSells = () =>
  usePouchDB(async () => {
    let result = await db.find({
      selector: {
        table: DBCollections.ORDER,
      },
      sort: [{ _id: "desc" }],
    });

    let orders = result.docs as Order[];

    let sellByPayment = aggregatePaymentMethods(orders);

    return sellByPayment;
  }, []);
