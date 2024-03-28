import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import CustomerDialog from "@/components/ui/customer-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/db";
import { OrderType } from "@/db/index.type";
import { useCustomer } from "@/hooks/db_query";
import { fetchAddress, getDistanceBetweenTwoPoints } from "@/lib/utils";
import type { DeliverySettingData as DeliverySettings } from "@/screens/delivery-settings";
import { useOrderStore } from "@/stores/order.store";
import { AddressResponse } from "@/types/AddressResponse";
import React from "react";
import { useParams } from "react-router-dom";

export type PARAMS = {
  order_type: OrderType;
};

export function ORDERDIALOG() {
  const { order_type } = useParams<PARAMS>();

  const [customerList] = useCustomer();
  const {
    address,
    delivery_charge,
    postcode,
    customer_id,
    setOrderStore,
    guest,
  } = useOrderStore((state) => ({
    address: state.address,
    delivery_charge: state.delivery_charge,
    postcode: state.postcode,
    customer_id: state.customer_id,
    setOrderStore: state.setOrderStore,
    guest: state.guest,
  }));
  const [addresses, setAddresses] = React.useState<AddressResponse["result"]>(
    []
  );

  const onBlur = async () => {
    let address = await fetchAddress(postcode);
    setAddresses(address.result ?? []);
  };

  const handleGuest = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderStore({ guest: +e.target.value });
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const getDeliverySettings = async (): Promise<DeliverySettings | false> => {
    try {
      return await db.get("config/_delivery");
    } catch {
      return false;
    }
  };

  const handleCustomerSelect = (customer_id: string) => {
    let customer = customerList?.find((item) => item._id === customer_id);

    if (!customer) return;

    setOrderStore({ customer_id: customer._id, customer_name: customer.name });
  };

  const handlePostCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderStore({ postcode: e.target.value });
  };

  const handleAddressChange = async (address: string) => {
    let addressDetails = addresses.find((item) => item.line_1 === address);
    let deliverySetting = await getDeliverySettings();
    if (!addressDetails || !deliverySetting) return;

    let distance = getDistanceBetweenTwoPoints(
      { lat: addressDetails.latitude, lon: addressDetails.longitude },
      { lat: deliverySetting.latitude, lon: deliverySetting.longitude }
    );

    let amount = deliverySetting.amount_factor * distance;

    setOrderStore({ delivery_charge: amount, address });
  };

  const handleDeliveryChargeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOrderStore({ delivery_charge: +e.target.value });
  };

  const shouldShowDeliverySection =
    order_type == OrderType.DELIVERY || order_type == OrderType.COLLECTION;

  const customerOptions =
    customerList?.map((item) => ({
      value: item._id,
      label: `${item.name} (${item.phone})`,
    })) ?? [];
  const addressOptions = addresses.map((item) => ({
    value: item.line_1,
    label: item.line_1,
  }));
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold" variant="ghost">
          <i className="fa-solid fa-exclamation-circle text-orange-500 text-lg mr-1"></i>
          Order Details
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[600px] max-w-none">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <form onSubmit={onSubmit}>
            <div>
              <label className="mt-2 text-sm">Select Customer</label>
              <Combobox
                popoverClassName="w-[400px]"
                value={customer_id}
                onChange={handleCustomerSelect}
                options={customerOptions}
                placeholder="Select Customer"
                searchPlaceholder="Search Customer..."
                notfoundText={
                  <div>
                    Couldn't find customer{" "}
                    <CustomerDialog>
                      <Button type="button" variant={"link"}>
                        Create New
                      </Button>
                    </CustomerDialog>
                  </div>
                }
              />
            </div>
            <div>
              <label className="mt-2 text-sm">Number of Guests</label>
              <Input value={guest} onChange={handleGuest} />
            </div>
            {shouldShowDeliverySection && (
              <>
                <div>
                  <label className="mt-2 text-sm">Postal Code</label>
                  <Input
                    value={postcode}
                    onChange={handlePostCodeChange}
                    onBlur={onBlur}
                  />
                </div>
                <div>
                  <label className="mt-2 text-sm">Select Address</label>
                  <Combobox
                    popoverClassName="w-[400px]"
                    value={address}
                    onChange={handleAddressChange}
                    options={addressOptions}
                    placeholder="Select Address"
                    searchPlaceholder="Search Address..."
                    notfoundText={"Couldn't find Address"}
                  />
                </div>
                <div>
                  <label className="mt-2 text-sm">Delivery Charge</label>
                  <Input
                    value={delivery_charge}
                    onChange={handleDeliveryChargeChange}
                  />
                </div>
              </>
            )}
            <DialogClose asChild>
              <Button className="max-w-[130px] mt-4" type="submit">
                Ok
              </Button>
            </DialogClose>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
