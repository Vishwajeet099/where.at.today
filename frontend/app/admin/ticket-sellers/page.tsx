"use client";

import { useEffect, useState } from "react";
import { getAdmin } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ListPanel from "@/components/ListPanel";
import GenericForm from "@/components/GenericForm";

export default function TicketSellersPage() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await getAdmin("ticket-sellers");
    setData(res);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 grid grid-cols-2 gap-6">
        <ListPanel
          title="Ticket Sellers"
          items={data}
          renderItem={(i) => <span>{i.name}</span>}
        />
        <GenericForm
          endpoint="ticket-sellers"
          fields={["website"]}
          onSuccess={load}
        />
      </div>
    </div>
  );
}