import { useState } from "react";

export const getRandomNumber = () =>
  Math.floor(Math.random() * 10 ** 6).toString();
export const useOrderIdentity = (): [
  string,
  () => void,
  React.Dispatch<React.SetStateAction<string>>
] => {
  const [random, setRandom] = useState(() => getRandomNumber());

  const refresh = () => {
    setRandom(getRandomNumber());
  };
  return [random, refresh, setRandom];
};
