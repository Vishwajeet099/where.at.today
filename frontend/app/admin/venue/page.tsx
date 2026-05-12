"use client";

import { useEffect, useState } from "react";
import { getAdmin, deleteAdmin } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import VenueForm from "@/components/VenueForm";
import ListPanel from "@/components/ListPanel";

export default function VenuePage() {
  const [venues, setVenues] = useState([]);

  const loadVenues = async () => {
    const data = await getAdmin("venues");
    setVenues(data);
  };

  const handleDeleteVenue = async (venueId: string, venueName: string) => {
    if (!confirm(`Are you sure you want to delete "${venueName}"?`)) {
      return;
    }

    try {
      await deleteAdmin(`venues/${venueId}`);
      alert("Venue deleted successfully!");
      loadVenues();
    } catch (err) {
      console.error("Error deleting venue:", err);
      alert("Error deleting venue");
    }
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
            <div className="flex justify-between items-start gap-2">
              <span>
                {v.name} ({v.city_name})
              </span>
              <button
                onClick={() => handleDeleteVenue(v.id, v.name)}
                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          )}
        />

        <VenueForm onSuccess={loadVenues} />
      </div>
    </div>
  );
}