import {
  DBCollections,
  Order,
  OrderSource,
  OrderStatus,
  OrderType,
} from "@/db/index.type";
import { generateBookingId } from "@/lib/utils";
import { create } from "zustand";

export interface OrderStoreAction {
  setOrderStore: (update: Partial<Order>) => void;
  resetState: () => void;
}
export const initialData: Order = {
  _id: generateBookingId().toString(),
  _rev: undefined,
  table: DBCollections.ORDER,
  modified: Date.now(),
  status: OrderStatus.PENDING,
  total_tax: 0,
  total_discount: 0,
  order_type: OrderType.DINE_IN,
  order_source: OrderSource.offline,
  customer_id: "",
  order_items: [],
  amount: 0,
  payment_option: "",
  customer_name: "",
  address: "",
  postcode: "",
  order_progress: 0,
  tables: [],
  kitchen_note: "",
  staff_note: "",
  payment_note: "",
  delivery_charge: 0,
  guest: 1,
};
export const useOrderStore = create<Order & OrderStoreAction>((set) => ({
  ...initialData,
  setOrderStore(update) {
    set(update);
  },
  resetState() {
    set({ ...initialData, _id: generateBookingId().toString() });
  },
}));

export const getOrderStoreSnapShot = () => {
  let order = structuredClone(initialData);
  let currentState = useOrderStore.getState();

  for (let key in order) {
    (order as any)[key as keyof Order] = currentState[key as keyof Order];
  }
  return order;
};
