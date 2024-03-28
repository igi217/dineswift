import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const menuAuth = atomWithStorage("@menu_collaped", false);

export const useCollapseStore = () => useAtom(menuAuth)