import { Category, OrderType } from "@/db/index.type";
import Img from "../ui/image";
import { API } from "@/constants";
import { useTerminalSettings } from "@/stores/settings";

export type CategoryBox = {
  category: Category;
  order_type: OrderType;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function CategoryBox(props: CategoryBox) {
  const [setting] = useTerminalSettings();

  const boxStyle = setting.color
    ? {
        background: props.category.backgroundColor,
        color: props.category.color,
      }
    : { background: "#fff" };
  if (!props.category[`${props.order_type}_show`]) return null;
  return (
    <div
      className="w-full cursor-pointer mb-2 aspect-square p-2 flex flex-col items-center justify-center rounded-md shadow-lg"
      style={boxStyle}
      {...props}
    >
      {setting.image ? (
        <Img
          className="w-full h-[60px] object-cover mb-2"
          src={API.BASE_URL + props.category.image}
          alt="Category"
        />
      ) : (
        <></>
      )}
      <span className="font-semibold" style={{ fontSize: setting.fontSize }}>
        {props.category.name}
      </span>
    </div>
  );
}
