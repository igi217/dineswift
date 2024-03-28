import { usePrinters } from "@/hooks/printer";
import { Button } from "./button";

export default function PrinterStatus({ id }: { id: string }) {
  const printers = usePrinters();

  const isConnected = printers.some((item) => item.id == id);

  if (isConnected)
    return (
      <Button size={"sm"} variant={"ghost"} className="text-green-500 text-sm">
        <i className="fa-regular fa-check-circle mr-1"></i>
        Connected
      </Button>
    );
  return (
    <Button size={"sm"} variant={"ghost"} className="text-yellow-500 text-sm">
      <i className="fa-regular fa-exclamation-circle mr-1"></i>
      Disconnected
    </Button>
  );
}
