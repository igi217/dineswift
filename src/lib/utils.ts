import { API } from "@/constants";
import { db } from "@/db";
import { Order } from "@/db/index.type";
import { useOrderStore } from "@/stores/order.store";
import { AddressResponse } from "@/types/AddressResponse";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export type Coordinate = {
  lat: number;
  lon: number;
};
export const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "GBP",
});

export const resolveRoute = (route: string, params: Record<string, any>) => {
  Object.keys(params).forEach((item) => {
    route = route.replace(":" + item, params[item]);
  });

  return route;
};

export const uploadFile = async (file: File) => {
  try {
    let formData = new FormData();
    formData.append("file", file);

    let response = await fetch(API.ASSET_UPLOAD, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: formData,
    });
    let payload = await response.json();

    if (response.ok) {
      return payload.file as string;
    }
  } catch {
    return false;
  }

  return false;
};

export const fetchRelationShip = async <TData>(
  keys: Array<`${Extract<keyof TData, string>}_id` & keyof TData>,
  data: Array<TData>
): Promise<Array<TData>> => {
  for (let doc of data) {
    for (let key of keys) {
      let table = key.replace("_id", "") as keyof TData;
      try {
        let relationShipData = await db.get(doc[key] as string);

        doc[table] = relationShipData as any;
      } catch {
        doc[table] = null as any;
      }
    }
  }
  return data;
};

export const deleteFile = async (file: string) => {
  try {
    if (file == "") return false;
    let formData = new FormData();
    formData.append("file", file);

    let response = await fetch(API.ASSET_DELETE, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: formData,
    });
    let payload = await response.json();
    console.log(payload);
    return true;
  } catch {
    return false;
  }
};

export function generateString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
export function generateBookingId() {
  return Math.floor(Math.random() * 10 ** 5);
}
export async function fetchAddress(postcode: string): Promise<AddressResponse> {
  let url = API.ADDRESS_API(postcode);

  let response = await fetch(url);
  let payload = await response.json();

  return payload;
}
export function getDistanceBetweenTwoPoints(
  cord1: Coordinate,
  cord2: Coordinate
) {
  if (cord1.lat == cord2.lat && cord1.lon == cord2.lon) {
    return 0;
  }

  const radlat1 = (Math.PI * cord1.lat) / 180;
  const radlat2 = (Math.PI * cord2.lat) / 180;

  const theta = cord1.lon - cord2.lon;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344; //convert miles to km

  return dist;
}
export const handleOrderSelect = async (id: string) => {
  let order: Order = await db.get(id);
  useOrderStore.setState(order);
};
export const groupBy = <T extends unknown>(
  values: T[],
  keyFinder: (value: T) => any
) => {
  // using reduce to aggregate values
  return values.reduce((a: any, b: any) => {
    // depending upon the type of keyFinder
    // if it is function, pass the value to it
    // if it is a property, access the property
    const key = typeof keyFinder === "function" ? keyFinder(b) : b[keyFinder];

    // aggregate values based on the keys
    if (!a[key]) {
      a[key] = [b];
    } else {
      a[key] = [...a[key], b];
    }

    return a;
  }, {});
};

export function aggregateDocuments<T, K extends keyof T>(
  orders: T[],
  search_key: keyof T,
  amount_key: K
) {
  let data: Record<any, any> = {};

  orders.forEach((order) => {
    const aKey = order[search_key] as string;
    const aValue = order[amount_key];
    console.log(aValue);
    if (aKey in data) {
      data[aKey] += aValue;
    } else {
      data[aKey] = aValue;
    }
  });
  return data;
}
export function aggregatePaymentMethods(
  orders: Order[]
): Record<string, number> {
  const paymentTotals: Record<string, number> = {};

  orders.forEach((order) => {
    const { amount, payment_option } = order;
    if (payment_option in paymentTotals) {
      paymentTotals[payment_option] += amount;
    } else {
      paymentTotals[payment_option] = amount;
    }
  });

  return paymentTotals;
}
export function flatChildArray<T, K extends keyof T, C extends Array<T[K]>>(
  items: T[],
  key: K
) {
  let resultArray: C = [] as unknown as C;

  items.forEach((item) => {
    resultArray.push(...(item[key] as C));
  });

  return resultArray;
}
