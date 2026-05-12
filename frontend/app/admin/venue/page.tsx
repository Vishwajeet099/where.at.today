"use client";

import { useEffect, useState } from "react";
import { getAdmin } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import VenueForm from "@/components/VenueForm";
import ListPanel from "@/components/ListPanel";

export default function VenuePage() {
  const [venues, setVenues] = useState([]);

  const loadVenues = async () => {
    const data = await getAdmin("venues");
    setVenues(data);
  };

  useEffect(() => {
    loadVenues();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 grid grid-cols-2 gap-6">
        
        <ListPanel
          title="Existing Venues"
          items={venues}
          renderItem={(v) => (
            <span>
              {v.name} ({v.city_name})
            </span>
          )}
        />

        <VenueForm onSuccess={loadVenues} />
      </div>
    </div>
  );
}