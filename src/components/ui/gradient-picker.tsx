import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { useMemo } from "react";

export function GradientPicker({
  background,
  setBackground,
  className,
}: {
  background: string;
  setBackground: (background: string) => void;
  className?: string;
}) {
  const solids = [
    "#ffffff",
    "#E2E2E2",
    "#ff75c3",
    "#ffa647",
    "#ffe83f",
    "#9fff5b",
    "#70e2ff",
    "#cd93ff",
    "#09203f",
    "#ef5350",
    "#f44336",
    "#e53935",
    "#ff1744",
    "#ec407a",
    "#e91e63",
    "#d81b60",
    "#f50057",
    "#ab47bc",
    "#9c27b0",
    "#8e24aa",
    "#d500f9",
    "#7e57c2",
    "#673ab7",
    "#5e35b1",
    "#651fff",
    "#5c6bc0",
    "#3f51b5",
    "#3949ab",
    "#3d5afe",
    "#42a5f5",
    "#2196f3",
    "#1e88e5",
    "#2979ff",
    "#29b6f6",
    "#03a9f4",
    "#039be5",
    "#00b0ff",
    "#26c6da",
    "#00bcd4",
    "#00acc1",
    "#00e5ff",
    "#26a69a",
    "#009688",
    "#00897b",
    "#1de9b6",
    "#66bb6a",
    "#4caf50",
    "#43a047",
    "#00e676",
    "#9ccc65",
    "#8bc34a",
    "#7cb342",
    "#76ff03",
    "#d4e157",
    "#cddc39",
    "#c0ca33",
    "#c6ff00",
    "#ffee58",
    "#ffeb3b",
    "#fdd835",
    "#ffea00",
    "#ffca28",
    "#ffc107",
    "#ffb300",
    "#ffc400",
    "#ffa726",
    "#ff9800",
    "#fb8c00",
    "#ff9100",
    "#ff7043",
    "#ff5722",
    "#f4511e",
    "#ff3d00",
    "#8d6e63",
    "#795548",
    "#6d4c41",
    "#bdbdbd",
    "#9e9e9e",
    "#757575",
    "#78909c",
    "#607d8b",
    "#546e7a",
  ];

  const gradients = [
    "linear-gradient(to right,#091E3A, #2F80ED, #2D9EE0)",
    "linear-gradient(to right,#9400D3, #4B0082)",
    "linear-gradient(to right,#c84e89, #F15F79)",
    "linear-gradient(to right,#00F5A0, #00D9F5)",
    "linear-gradient(to right,#F7941E, #72C6EF, #00A651)",
    "linear-gradient(to right,#F7941E, #004E8F)",
    "linear-gradient(to right,#72C6EF, #004E8F)",
    "linear-gradient(to right,#FD8112, #0085CA)",
    "linear-gradient(to right,#bf5ae0, #a811da)",
    "linear-gradient(to right,#fbed96, #abecd6)",
    "linear-gradient(to right,#FFE000, #799F0C)",
    "linear-gradient(to right,#F7F8F8, #ACBB78)",
    "linear-gradient(to right,#00416A, #799F0C, #FFE000)",
    "linear-gradient(to right,#334d50, #cbcaa5)",
    "linear-gradient(to right,#0052D4, #4364F7, #6FB1FC)",
    "linear-gradient(to right,#5433FF, #20BDFF, #A5FECB)",
    "linear-gradient(to right,#799F0C, #ACBB78)",
    "linear-gradient(to right,#ffe259, #ffa751)",
    "linear-gradient(to right,#acb6e5, #86fde8)",
    "linear-gradient(to right,#536976, #292E49)",
    "linear-gradient(to right,#B79891, #94716B)",
    "linear-gradient(to right,#9796f0, #fbc7d4)",
    "linear-gradient(to right,#BBD2C5, #536976)",
    "linear-gradient(to right,#076585, #fff)",
    "linear-gradient(to right,#00467F, #A5CC82)",
    "linear-gradient(to right,#000C40, #607D8B)",
    "linear-gradient(to right,#1488CC, #2B32B2)",
    "linear-gradient(to right,#ec008c, #fc6767)",
    "linear-gradient(to right,#cc2b5e, #753a88)",
    "linear-gradient(to right,#e65c00, #F9D423)",
    "linear-gradient(to right,#2b5876, #4e4376)",
    "linear-gradient(to right,#314755, #26a0da)",
    "linear-gradient(to right,#77A1D3, #79CBCA, #E684AE)",
    "linear-gradient(to right,#ff6e7f, #bfe9ff)",
    "linear-gradient(to right,#e52d27, #b31217)",
    "linear-gradient(to right,#603813, #b29f94)",
    "linear-gradient(to right,#16A085, #F4D03F)",
    "linear-gradient(to right,#D31027, #EA384D)",
    "linear-gradient(to right,#EDE574, #E1F5C4)",
    "linear-gradient(to right,#02AAB0, #00CDAC)",
    "linear-gradient(to right,#DA22FF, #9733EE)",
    "linear-gradient(to right,#348F50, #56B4D3)",
    "linear-gradient(to right,#3CA55C, #B5AC49)",
    "linear-gradient(to right,#CC95C0, #DBD4B4, #7AA1D2)",
    "linear-gradient(to right,#003973, #E5E5BE)",
    "linear-gradient(to right,#E55D87, #5FC3E4)",
    "linear-gradient(to right,#403B4A, #E7E9BB)",
    "linear-gradient(to right,#F09819, #EDDE5D)",
    "linear-gradient(to right,#FF512F, #DD2476)",
    "linear-gradient(to right,#AA076B, #61045F)",
    "linear-gradient(to right,#1A2980, #26D0CE)",
    "linear-gradient(to right,#FF512F, #F09819)",
    "linear-gradient(to right,#1D2B64, #F8CDDA)",
    "linear-gradient(to right,#1FA2FF, #12D8FA, #A6FFCB)",
    "linear-gradient(to right,#4CB8C4, #3CD3AD)",
    "linear-gradient(to right,#DD5E89, #F7BB97)",
    "linear-gradient(to right,#EB3349, #F45C43)",
    "linear-gradient(to right,#1D976C, #93F9B9)",
    "linear-gradient(to right,#FF8008, #FFC837)",
    "linear-gradient(to right,#16222A, #3A6073)",
    "linear-gradient(to right,#1F1C2C, #928DAB)",
    "linear-gradient(to right,#614385, #516395)",
    "linear-gradient(to right,#4776E6, #8E54E9)",
    "linear-gradient(to right,#085078, #85D8CE)",
    "linear-gradient(to right,#2BC0E4, #EAECC6)",
    "linear-gradient(to right,#134E5E, #71B280)",
    "linear-gradient(to right,#5C258D, #4389A2)",
    "linear-gradient(to right,#757F9A, #D7DDE8)",
    "linear-gradient(to right,#232526, #414345)",
    "linear-gradient(to right,#1CD8D2, #93EDC7)",
    "linear-gradient(to right,#3D7EAA, #FFE47A)",
    "linear-gradient(to right,#283048, #859398)",
    "linear-gradient(to right,#24C6DC, #514A9D)",
    "linear-gradient(to right,#DC2424, #4A569D)",
    "linear-gradient(to right,#ED4264, #FFEDBC)",
    "linear-gradient(to right,#DAE2F8, #D6A4A4)",
    "linear-gradient(to right,#ECE9E6, #FFFFFF)",
    "linear-gradient(to right,#7474BF, #348AC7)",
    "linear-gradient(to right,#EC6F66, #F3A183)",
    "linear-gradient(to right,#5f2c82, #49a09d)",
    "linear-gradient(to right,#C04848, #480048)",
    "linear-gradient(to right,#e43a15, #e65245)",
    "linear-gradient(to right,#414d0b, #727a17)",
    "linear-gradient(to right,#FC354C, #0ABFBC)",
    "linear-gradient(to right,#4b6cb7, #182848)",
    "linear-gradient(to right,#f857a6, #ff5858)",
    "linear-gradient(to right,#a73737, #7a2828)",
    "linear-gradient(to right,#d53369, #cbad6d)",
    "linear-gradient(to right,#e9d362, #333333)",
    "linear-gradient(to right,#DE6262, #FFB88C)",
    "linear-gradient(to right,#666600, #999966)",
    "linear-gradient(to right,#FFEEEE, #DDEFBB)",
    "linear-gradient(to right,#EFEFBB, #D4D3DD)",
    "linear-gradient(to right,#c21500, #ffc500)",
    "linear-gradient(to right,#215f00, #e4e4d9)",
    "linear-gradient(to right,#50C9C3, #96DEDA)",
    "linear-gradient(to right,#ddd6f3, #faaca8)",
    "linear-gradient(to right,#5D4157, #A8CABA)",
    "linear-gradient(to right,#E6DADA, #274046)",
    "linear-gradient(to right,#f2709c, #ff9472)",
  ];

  const defaultTab = useMemo(() => {
    if (background.includes("url")) return "image";
    if (background.includes("gradient")) return "gradient";
    return "solid";
  }, [background]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[220px] justify-start text-left font-normal",
            !background && "text-muted-foreground",
            className
          )}
        >
          <div className="w-full flex items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              ></div>
            ) : (
              <i className="h-4 w-4 fa-solid fa-paint-roller" />
            )}
            <div className="truncate flex-1">
              {background ? background : "Pick a color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        <Tabs defaultValue={defaultTab} className="">
          <TabsList className="w-full mb-4">
            <TabsTrigger className="flex-1" value="solid">
              Solid
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="gradient">
              Gradient
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="flex flex-wrap gap-1 mt-0">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                onClick={() => setBackground(s)}
              />
            ))}
          </TabsContent>

          <TabsContent value="gradient" className="mt-0">
            <div className="flex flex-wrap gap-1 mb-2">
              {gradients.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                  onClick={() => setBackground(s)}
                />
              ))}
            </div>

            <GradientButton background={background}>
              💡 Get more at{" "}
              <a
                href="https://gradient.page/css/ui-gradients"
                className="hover:underline font-bold"
                target="_blank"
              >
                Gradient Page
              </a>
            </GradientButton>
          </TabsContent>

          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>

        <Input
          id="custom"
          value={background}
          className="col-span-2 h-8 mt-4"
          onChange={(e) => setBackground(e.currentTarget.value)}
        />
      </PopoverContent>
    </Popover>
  );
}

const GradientButton = ({
  background,
  children,
}: {
  background: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className="p-0.5 rounded-md relative !bg-cover !bg-center transition-all"
      style={{ background }}
    >
      <div className="bg-popover/80 rounded-md p-1 text-xs text-center">
        {children}
      </div>
    </div>
  );
};
