"use client";

import { useEffect, useState } from "react";
import { getAdmin } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ListPanel from "@/components/ListPanel";
import GenericForm from "@/components/GenericForm";

export default function CategoriesPage() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await getAdmin("categories");
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
          title="Categories"
          items={data}
          renderItem={(i) => <span>{i.name}</span>}
        />

        <GenericForm
          endpoint="categories"
          fields={["icon_key", "color_hex"]}
          onSuccess={load}
        />
      </div>
    </div>
  );
}