import React from "react";

export interface Img
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string;
}

export default function Img(props: Img) {
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let image = new Image();

    image.src = props.src;

    image.onload = function () {
      setError(false);
    };
    image.onerror = function () {
      setError(true);
    };
  }, [props.src]);

  if (error) return <div {...props}></div>;

  return <img {...props} />;
}
