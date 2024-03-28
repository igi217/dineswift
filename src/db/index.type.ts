export enum DBCollections {
  USER = "users",
  CONFIG = "config",
  ORDER = "orders",
  CUSTOMER = "customers",
  ITEM = "items",
  CATEGORY = "categories",
  INGREDIENT = "ingredients",
  ALLERGENS = "allergens",
  REMOVE = "removes",
  MODIFIER = "modifier",
  MODIFIER_GROUP = "modifier_group",
  FILTER_ATTRIBUTE = "filter_attribute",
  FILTER = "filter",
  PRINTER = "printers",
  DEPTS = "depts",
  EXPENSE_TYPE = "expense_type",
  EXPENSE = "expense",
  AREA = "area",
  TABLE = "table",
  BOOKING = "booking",
  CUSTOMER_TYPE = "customer_type",
  TESTIMONIAL = "testimonial",
  FAQ = "faq",
  SUBSCRIBER = "subscriber",
  DISCOUNT = "discounts",
  COUPON = "coupon",
  PAYMENT_METHODS = "payment_methods",
  PAYMENT_CONFIG = "payment_config",
  COUPON_SELL = "coupon_sell",
  NOTIFICATION = "notification",
  CALLS = "calls",
}

export enum NOTIFICATIONSTATUS {
  PENDING,
  SUCCESS,
}

export enum NOTIFICATIONCATEGORY {
  TERMINAL,
  KDS,
}

export enum OrderStatus {
  PENDING = 0,
  CANCELED = 2,
  COOKING = 3,
  SUCCESS = 1,
}
export const OrderStatusMap = new Map([
  [0, "Pending"],
  [2, "Canceled"],
  [1, "Completed"],
  [3, "Serving"],
]);
export enum OrderType {
  DELIVERY = "delivery",
  TAKE_AWAY = "take_away",
  COLLECTION = "collection",
  DINE_IN = "dine_in",
}

export enum OrderSource {
  "online",
  "offline",
}
export type OtherProduct = {
  category_id: string;
  category_name: string;
  product_id: string;
  product_name: string;
};
export type Product = {
  _id: string;
  _rev: string;
  code: string;
  modified: number;
  name: string;
  description: string;
  image: string;
  discount_name: string;
  discount_percentage: number;
  category: Category | null;
  category_id: string;
  cost: number;
  delivery_price: number;
  collection_price: number;
  take_away_price: number;
  dine_in_price: number;
  total_tax: number;
  department_id: string;
  department: Department | null;
  color: string;
  backgroundColor: string;
  modifier_group_id: string;
  modifier_group: ModifierGroup | null;
  filter: string[];
  allergen: string[];
  is_setmeal?: boolean;
  other_products: OrderProduct[];
};

export type OrderProduct = {
  product: Product;
  count: number;
  discount: number;
  tax: number;
  subtotal: number;
  remove_instruction: RemoveInstruction[];
  modifier: Modifier[];
  modifier_cost: number;
  total: number;
  completed?: boolean;
  payed?: boolean;
};

export type Order = {
  _id: string;
  _rev: string | undefined;
  table: DBCollections.ORDER;
  modified: number;
  status: OrderStatus;
  total_tax: number;
  total_discount: number;
  order_type: OrderType;
  order_source: OrderSource;
  customer_id: string;
  order_items: OrderProduct[];
  amount: number;
  payment_option: string;
  customer_name: string;
  address: string;
  postcode: string;
  order_progress: number;
  tables: Table[];
  kitchen_note: string;
  staff_note: string;
  payment_note: string;
  delivery_charge: number;
  guest: number;
};

export type Customer = {
  _id: string;
  _rev: string;
  modified: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  password: string;
  customer_type: string;
};

export type CustomerType = {
  _id: string;
  _rev: string;
  modified: string;
  name: string;
};

export type Tax = {
  name: string;
  percentage: number;
};
export type Config = {
  _id: string;
  _rev: string;
  modified: number;
  taxes: Tax[];
  total_tax: number;
};

export type Category = {
  _id: string;
  _rev: string;
  modified: number;
  total_tax: number;
  name: string;
  image: string;
  color: string;
  backgroundColor: string;
  dine_in_show: boolean;
  collection_show: boolean;
  take_away_show: boolean;
  delivery_show: boolean;
  description: string;
};
export type Ingredient = {
  _id: string;
  _rev: string;
  modified: number;
  name: string;
  cost: number;
  price: number;
  unit: string;
  stock: number;
  alert: number;
};

export type Allergen = {
  _id: string;
  _rev: string;
  modified: number;
  name: string;
};

export type RemoveInstruction = {
  _id: string;
  _rev: string;
  modified: number;
  name: string;
};
export type ModifierGroup = {
  _id: string;
  _rev: string;
  modified: number;
  name: string;
  description: string;
  color: string;
  backgroundColor: string;
  dine_in_show: boolean;
  collection_show: boolean;
  take_away_show: boolean;
  delivery_show: boolean;
};
export type Modifier = {
  _id: string;
  _rev: string;
  modified: number;
  modifier_group_id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  unit: string;
};

export type FilterAttribute = {
  _id: string;
  _rev: string;
  modified: number;
  attribute: string;
  filters: Filter[];
};
export type Filter = {
  _id: string;
  _rev: string;
  modified: number;
  filter_attribute_id: string;
  value: string;
  filter_attribute: null | FilterAttribute;
};

export type Printer = {
  device_name: string;
  id: string;
  name: string;
  modified: number;
  paper_size: number;
  _id: string;
  _rev: string;
};

export type Department = {
  _id: string;
  _rev: string;
  modified: number;
  name: string;
  printer_id: string;
  printer: Printer | null;
};

export type ExpenseType = {
  _id: string;
  _rev: string;
  modified: number;
  name: string;
};
export type Expense = {
  _id: string;
  _rev: string;
  modified: number;
  cost: number;
  expense_type_id: string;
  expense_type: ExpenseType | null;
  description: string;
};

export type Area = {
  _id: string;
  _rev: string;
  name: string;
  modified: number;
};

export type Table = {
  _id: string;
  _rev: string;
  name: string;
  modified: number;
  capacity: number;
  area_id: string;
  area: Area | null;
  status: number;
  status_message: string;
  bookings: Booking[];
  orders: Order[];
};

export type Booking = {
  _id: string;
  _rev: string;
  modified: number;
  customer_id: string;
  customer: Customer | null;
  customer_name: string;
  datetime: number;
  tables: string[];
  guest: number;
  notes: string;
  status: 0 | 1 | 2;
  tableData: Table[];
};

export type Testimonial = {
  _id: string;
  _rev: string;
  modified: number;
  name: string;
  designation: string;
  description: string;
  rating: number;
};
export type FAQ = {
  _id: string;
  _rev: string;
  modified: number;
  question: string;
  answer: string;
};

export type Subscriber = {
  _id: string;
  _rev: string;
  modified: number;
  email: string;
};

export type Discount = {
  _id: string;
  _rev: string;
  modified: number;
  name: string;
  categories: [];
  percentage: number;
};

export type Coupon = {
  _id: string;
  _rev: string;
  modified: number;
  name: string;
  code: string;
  categories: [];
  percentage: number;
};
export type PaymentMethods = {
  _id: string;
  _rev: string;
  modifier: number;
  name: string;
  default: boolean;
  status: boolean;
};

export type CouponSell = {
  _id: string;
  _rev: string;
  modifier: number;
  coupon_id: string;
  customer_id: string;
  coupon?: Coupon;
  customer?: Customer;
};

export type NOTIFICATION = {
  _id: string;
  _rev: string;
  modifier: number;
  title: string;
  content: string;
  category: NOTIFICATIONCATEGORY;
  status: NOTIFICATIONSTATUS;
  link: string;
  table: DBCollections.NOTIFICATION;
};
export type CALL = {
  modified: number;
  phoneNumber: string;
  table: string;
  user_id: string;
  _id: string;
  _rev: string;
};
export type GeneralSetting = {
  name: string;
  modified: number;
  phone: string;
  email: string;
  address: string;
  description: string;
  _id: string;
  _rev: string;
};
// export type Order = {
//     _id
// }
