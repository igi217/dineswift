import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API } from "@/constants";
import {
  Modifier,
  OrderProduct,
  OrderType,
  Product,
  RemoveInstruction,
} from "@/db/index.type";
import { useModifier, useRemoveList } from "@/hooks/db_query";
import { cn, numberFormatter } from "@/lib/utils";
import { useTerminalSettings } from "@/stores/settings";
import React from "react";
import Img from "../ui/image";
import { Badge } from "../ui/badge";
import { useParams } from "react-router-dom";
import { useOrderStore } from "@/stores/order.store";

export type Params = {
  order_type: OrderType;
};
export type ProductBox = {
  product: Product;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export enum DialogMode {
  COUNT,
  MODIFIER,
  REMOVE_INSTRUCTION,
}
export type CountDialog = {
  count: number;
  setCount: (value: number) => void;
  setDialog: (value: DialogMode | boolean) => void;
  open: boolean;
  finishAction: () => void;
};
export function CountDialog(props: CountDialog) {
  return (
    <Dialog open={props.open} onOpenChange={props.setDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="count">How many of this</Label>
          <div className="flex flex-row items-center gap-3">
            <Button
              onClick={() =>
                props.setCount(props.count == 0 ? props.count : props.count - 1)
              }
            >
              <i className="fa-regular fa-minus"></i>
            </Button>
            <Input
              id="count"
              type="number"
              value={props.count}
              onChange={(e) =>
                props.setCount(+e.target.value ? +e.target.value : 1)
              }
              className="col-span-3"
            />

            <Button onClick={() => props.setCount(props.count + 1)}>
              <i className="fa-regular fa-plus"></i>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={"ghost"}
            className="mr-2"
            onClick={() => props.finishAction()}
            type="button"
          >
            Finish
          </Button>
          <Button
            onClick={() => props.setDialog(DialogMode.MODIFIER)}
            type="button"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export type ModifierDialog = {
  modifiers: Modifier[];
  setModifiers: (value: Modifier[]) => void;
  setDialog: (value: DialogMode | boolean) => void;
  finishAction: () => void;
  open: boolean;
};
export function ModifierDialog(props: ModifierDialog) {
  const [modifierLists] = useModifier();

  const className = "bg-gradient-to-r from-[#4776E6] to-[#8E54E9]";

  const activeClassName = "bg-gradient-to-r from-[#4CB8C4] to-[#3CD3AD]";
  return (
    <Dialog open={props.open} onOpenChange={props.setDialog}>
      <DialogContent className="max-w-none w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Modifiers</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {modifierLists?.map((item) => (
            <div
              onClick={() => {
                if (
                  props.modifiers.some((modifier) => modifier._id === item._id)
                ) {
                  props.setModifiers(
                    props.modifiers.filter(
                      (modifier) => modifier._id !== item._id
                    )
                  );
                  return;
                }
                props.setModifiers([...props.modifiers, item]);
              }}
              key={item._id}
              className={cn(
                "min-h-[50px] shadow-md transition cursor-pointer text-sm text-white rounded-sm flex items-center justify-center",
                props.modifiers.some((modifier) => modifier._id === item._id)
                  ? activeClassName
                  : className
              )}
            >
              {item.name}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant={"ghost"}
            className="mr-2"
            onClick={() => props.finishAction()}
            type="button"
          >
            Finish
          </Button>
          <Button
            onClick={() => props.setDialog(DialogMode.REMOVE_INSTRUCTION)}
            type="button"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type RemoveDialog = {
  remove_instruction: RemoveInstruction[];
  setRemoveInstruction: (value: RemoveInstruction[]) => void;
  setDialog: (value: DialogMode | boolean) => void;
  open: boolean;
};
export function RemoveDialog(props: RemoveDialog) {
  const [removeLists] = useRemoveList();

  const className = "bg-gradient-to-r from-[#4776E6] to-[#8E54E9]";

  const activeClassName = "bg-gradient-to-r from-[#FF512F] to-[#DD2476]";
  return (
    <Dialog open={props.open} onOpenChange={props.setDialog}>
      <DialogContent className="max-w-none w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Remove Instructions</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {removeLists?.map((item) => (
            <div
              onClick={() => {
                if (
                  props.remove_instruction.some(
                    (remove) => remove._id === item._id
                  )
                ) {
                  props.setRemoveInstruction(
                    props.remove_instruction.filter(
                      (remove) => remove._id !== item._id
                    )
                  );
                  return;
                }
                props.setRemoveInstruction([...props.remove_instruction, item]);
              }}
              key={item._id}
              className={cn(
                "min-h-[50px] shadow-md transition cursor-pointer text-sm text-white rounded-sm flex items-center justify-center",
                props.remove_instruction.some(
                  (remove) => remove._id === item._id
                )
                  ? activeClassName
                  : className
              )}
            >
              {item.name}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            onClick={() => props.setDialog(DialogMode.REMOVE_INSTRUCTION)}
            type="button"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default function ProductBox(props: ProductBox) {
  const { order_type } = useParams<Params>();
  const { items, setOrderStore } = useOrderStore((state) => ({
    items: state.order_items,
    setOrderStore: state.setOrderStore,
  }));
  const [setting] = useTerminalSettings();
  const [count, setCount] = React.useState(1);
  const [modifiers, setModifiers] = React.useState<Modifier[]>([]);
  const [remove_instruction, setRemoveInstruction] = React.useState<
    RemoveInstruction[]
  >([]);
  const [dialog, setDialog] = React.useState<DialogMode | boolean>(false);
  const discount =
    (props.product.discount_percentage / 100) *
    props.product[`${order_type!}_price`] *
    count;

  const tax =
    ((props.product.category?.total_tax ?? 0) / 100) *
    props.product[`${order_type!}_price`] *
    count;

  const subtotal = props.product[`${order_type!}_price`] * count;

  const modifier_cost = modifiers.reduce((prev, item) => prev + item.price, 0);

  const total = modifier_cost + subtotal + tax - discount;

  const details: OrderProduct = {
    product: props.product,
    count,
    discount,
    tax,
    subtotal,
    remove_instruction,
    modifier: modifiers,
    modifier_cost,
    total,
  };

  const boxStyle = setting.color
    ? {
        background: props.product.backgroundColor,
        color: props.product.color,
        justifyContent: "center",
      }
    : { background: "#fff" };

  const handleAddItem = () => {
    setDialog(false);
    setOrderStore({ order_items: [...items, details] });
  };
  if (!props.product.category?.[`${order_type!}_show`]) return null;
  return (
    <>
      <div
        onClick={() => setDialog(DialogMode.COUNT)}
        className="w-full h-fit min-h-[130px] cursor-pointer flex flex-col items-center rounded-md shadow-lg"
        style={boxStyle}
      >
        {setting.image ? (
          <Img
            className="w-full h-[80px] object-cover"
            src={API.BASE_URL + props.product.image}
            alt="Product"
          />
        ) : (
          <></>
        )}
        <span
          className="font-semibold mt-2"
          style={{ fontSize: setting.fontSize * 1.2 }}
        >
          {props.product.name}
        </span>
        <span
          className="font-semibold mb-2"
          style={{ fontSize: setting.fontSize }}
        >
          {numberFormatter.format(props.product[`${order_type!}_price`])}
        </span>
      </div>
      <CountDialog
        open={dialog === DialogMode.COUNT}
        count={count}
        setCount={setCount}
        finishAction={handleAddItem}
        setDialog={setDialog}
      />
      <ModifierDialog
        open={dialog === DialogMode.MODIFIER}
        setDialog={setDialog}
        setModifiers={setModifiers}
        finishAction={handleAddItem}
        modifiers={modifiers}
      />
      <RemoveDialog
        open={dialog === DialogMode.REMOVE_INSTRUCTION}
        setDialog={handleAddItem}
        setRemoveInstruction={setRemoveInstruction}
        remove_instruction={remove_instruction}
      />
    </>
  );
}

export type OrderProductBox = {
  item: OrderProduct;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export function OrderProductBox(props: OrderProductBox) {
  const { order_type } = useParams<Params>();
  const { items, setOrderStore } = useOrderStore((state) => ({
    items: state.order_items,
    setOrderStore: state.setOrderStore,
  }));
  const [count, setCount] = React.useState(props.item.count);
  const [modifiers, setModifiers] = React.useState<Modifier[]>(
    props.item.modifier
  );
  const [remove_instruction, setRemoveInstruction] = React.useState<
    RemoveInstruction[]
  >(props.item.remove_instruction);
  const [dialog, setDialog] = React.useState<DialogMode | boolean>(false);

  const subtotal = props.item.product[`${order_type!}_price`] * count;

  const discount = (props.item.product.discount_percentage / 100) * subtotal;
  const tax = ((props.item.product.category?.total_tax ?? 0) / 100) * subtotal;
  const modifier_cost = modifiers.reduce((prev, item) => prev + item.price, 0);

  const total = modifier_cost + subtotal + tax - discount;

  const details: OrderProduct = {
    product: props.item.product,
    count,
    discount,
    tax,
    subtotal,
    remove_instruction,
    modifier: modifiers,
    modifier_cost,
    total,
  };

  const handleUpdateItem = () => {
    setDialog(false);
    setOrderStore({
      order_items: items.map((i) => {
        if (i.product._id === props.item.product._id) {
          return details;
        }
        return i;
      }),
    });
  };
  const handleDeleteItem = () => {
    let updated = items.filter((i) => i.product._id !== props.item.product._id);
    setOrderStore({
      order_items: updated,
    });
  };
  if (!props.item.product.category?.[`${order_type!}_show`]) return null;
  return (
    <>
      <div className="w-full border-b border-b-slate-300 h-fit min-h-[80px] flex flex-row items-center justify-between">
        <div className="font-semibold w-[calc(100%-100px)] flex flex-col pl-3">
          <span className="mb-3">
            {props.item.completed && (
              <i className="text-lg text-green-500 fa-solid fa-check-circle mr-2"></i>
            )}
            {props.item.product.name}
          </span>
          <div>
            {props.item.modifier.map((item, index) => (
              <Badge key={index} className="bg-green-500 hover:bg-green-700">
                +{item.name}
              </Badge>
            ))}
          </div>
          <div className="mt-1">
            {props.item.remove_instruction.map((item, index) => (
              <Badge key={index} className="bg-red-500 hover:bg-red-700">
                -{item.name}
              </Badge>
            ))}
          </div>
          {!props.item.completed && (
            <div className="w-full mt-auto flex flex-row items-center justify-stretch">
              <Button
                className="text-red-500"
                onClick={handleDeleteItem}
                size={"sm"}
                variant={"ghost"}
              >
                <i className="fa-solid fa-trash-alt mr-1"></i>
                Remove
              </Button>
              <Button
                className="text-cyan-500"
                onClick={() => setDialog(DialogMode.COUNT)}
                size={"sm"}
                variant={"ghost"}
              >
                <i className="fa-solid fa-pencil mr-1"></i>
                Edit
              </Button>
            </div>
          )}
        </div>
        <div className="pr-3 h-full font-medium flex flex-col w-[100px] border-l border-slate-300">
          <span className="pl-3">
            {numberFormatter.format(props.item.product[`${order_type!}_price`])}{" "}
            &times; {props.item.count}{" "}
          </span>
          <span className="pl-3">
            {props.item.modifier_cost
              ? numberFormatter.format(props.item.modifier_cost)
              : null}
          </span>
          <span className="block pl-3 w-full border-t border-slate-300 font-semibold text-[22px]">
            {numberFormatter.format(
              props.item.subtotal + props.item.modifier_cost
            )}
          </span>
        </div>
      </div>
      <CountDialog
        finishAction={handleUpdateItem}
        open={dialog === DialogMode.COUNT}
        count={count}
        setCount={setCount}
        setDialog={setDialog}
      />
      <ModifierDialog
        finishAction={handleUpdateItem}
        open={dialog === DialogMode.MODIFIER}
        setDialog={setDialog}
        setModifiers={setModifiers}
        modifiers={modifiers}
      />
      <RemoveDialog
        open={dialog === DialogMode.REMOVE_INSTRUCTION}
        setDialog={handleUpdateItem}
        setRemoveInstruction={setRemoveInstruction}
        remove_instruction={remove_instruction}
      />
    </>
  );
}
