"use client";

import { useEffect, useState } from "react";
import { getAdmin } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import CityForm from "@/components/CityForm";
import ListPanel from "@/components/ListPanel";

export default function CityPage() {
  const [cities, setCities] = useState([]);

  const loadCities = async () => {
    const data = await getAdmin("cities");
    setCities(data);
  };

  useEffect(() => {
    loadCities();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 grid grid-cols-2 gap-6">
        
        <ListPanel
          title="Existing Cities"
          items={cities}
          renderItem={(c) => <span>{c.name}</span>}
        />

        <CityForm onSuccess={loadCities} />
      </div>
    </div>
  );
}