import { db } from "@/db";
import React from "react";

export default function usePouchDB<T>(query: () => Promise<T>, deps: any[]) {
  const [data, setData] = React.useState<T>();

  React.useEffect(() => {
    query().then((data) => setData(data));
    db.changes({
      since: "now",
      live: true,
    }).on("change", async () => {
      setData(await query());
    });

    return () => db.removeAllListeners("change") as any;
  }, [...deps]);

  return [data] as const;
}
