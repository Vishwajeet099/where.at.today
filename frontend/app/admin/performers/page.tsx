"use client";

import { useEffect, useState } from "react";
import { getAdmin } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ListPanel from "@/components/ListPanel";
import GenericForm from "@/components/GenericForm";

export default function PerformersPage() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await getAdmin("performers");
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
          title="Performers"
          items={data}
          renderItem={(i) => <span>{i.name}</span>}
        />
        <GenericForm
          endpoint="performers"
          fields={["bio"]}
          onSuccess={load}
        />
      </div>
    </div>
  );
}