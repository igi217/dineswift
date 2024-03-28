import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const settingAtom = atomWithStorage("@settings", {
  fontSize: 14,
  color: false,
  image: true,
});

export const useTerminalSettings = () => useAtom(settingAtom);
