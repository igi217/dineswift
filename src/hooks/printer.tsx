import React from "react";

import { printers as getPrinters } from "tauri-plugin-printer";

export type Printer = {
  id: string;
  name: string;
  driver_name: string;
  job_count: number;
  print_processor: string;
  port_name: string;
  share_name: string;
  computer_name: string;
  printer_status: number;
  shared: boolean;
  type: number;
  priority: number;
};
export const usePrinters = () => {
  const [printers, setPrinters] = React.useState<Printer[]>([]);

  React.useEffect(() => {
    (async () => {
      let result = await getPrinters();
      setPrinters(result);
    })();
  }, []);

  return printers;
};
