import { cn } from "@/lib/utils";
import React from "react";

export type Tab<T> = {
  label: any;
  value: T;
};

export type TabList<T> = {
  tabs?: Tab<T>[];
  value: any;
  setValue: (val: T) => void;
  className?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  indicatorClassName?: string;
};

export function TabList<T>(props: TabList<T>) {
  const [position, setPosition] = React.useState({
    left: 0,
    width: 0,
  });
  const tablistRef = React.useRef<HTMLDivElement>(null);
  const classNameActive = cn(
    "text-indigo-500 bg-slate-100",
    props.activeButtonClassName
  );

  React.useEffect(() => {
    let activePos =
      tablistRef.current?.querySelector<HTMLButtonElement>(
        `[data-active="true"]`
      );

    if (activePos) {
      if (activePos!.offsetLeft > position.left) {
        setPosition((position) => ({
          left: position.left,
          width: activePos!.clientWidth + activePos!.offsetLeft - position.left,
        }));

        let timeout = setTimeout(() => {
          setPosition({
            left: activePos!.offsetLeft,
            width: activePos!.clientWidth,
          });
          clearTimeout(timeout);
        }, 300);
      } else {
        setPosition((position) => ({
          left: activePos!.offsetLeft,
          width: position.left + position.width - activePos!.offsetLeft,
        }));

        let timeout = setTimeout(() => {
          setPosition({
            left: activePos!.offsetLeft,
            width: activePos!.clientWidth,
          });
          clearTimeout(timeout);
        }, 300);
      }
    }
  }, [props.value]);
  return (
    <div
      ref={tablistRef}
      className={cn(
        "relative flex flex-row items-center justify-stretch h-full w-full",
        props.className
      )}
    >
      {props.tabs?.map((item) => {
        let active = item.value == props.value;
        return (
          <button
            data-active={active}
            onClick={() => props.setValue(item.value)}
            className={cn(
              "flex uppercase h-full whitespace-nowrap font-semibold items-center justify-center px-4",
              active ? classNameActive : undefined
            )}
            key={item.value as string}
          >
            {item.label}
          </button>
        );
      })}
      <div
        style={position}
        className={cn(
          "h-[2px] bg-indigo-500 w-10 absolute left-0 bottom-0 transition-all",
          props.indicatorClassName
        )}
      ></div>
    </div>
  );
}
