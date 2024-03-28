import React from "react";

export interface ListViewProps<T> {
  index: number;
  item: T;
}
export interface ListView<T> {
  data?: T[];
  render: (args: ListViewProps<T>) => React.ReactNode;
}

export const ListView = <T extends unknown>(props: ListView<T>) => {
  const { data, render } = props;

  return (
    <>
      {data?.map((item, index) => (
        <React.Fragment key={index}>{render({ item, index })}</React.Fragment>
      ))}
    </>
  );
};
