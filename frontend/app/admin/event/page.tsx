"use client";

import { useEffect, useState } from "react";
import { getAdmin, patchAdmin, deleteAdmin } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import EventForm from "@/components/EventForm";
import ListPanel from "@/components/ListPanel";

export default function EventPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("Events state changed:", events);
  }, [events]);

  const loadEvents = async () => {
    try {
      const data = await getAdmin("events");
      console.log("Loaded events:", data);
      setEvents(data);
      console.log("Events state updated with", data.length, "events");
    } catch (err) {
      console.error("Error loading events:", err);
    }
  };

  const togglePublish = async (eventId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "draft" ? "published" : "draft";
      await patchAdmin(`events/${eventId}/status`, { status: newStatus });
      loadEvents();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating event status");
    }
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteAdmin(`events/${eventId}`);
      alert("Event deleted successfully!");
      loadEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Error deleting event");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 grid grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Existing Events</h2>
            <button
              onClick={loadEvents}
              className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
            >
              ↻ Refresh
            </button>
          </div>
          <ListPanel
            title=""
            items={events}
            renderItem={(e) => (
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="font-semibold">{e.title}</div>
                  <div className="text-sm text-gray-500">
                    {e.city_name} • {e.instance_count} instance
                    {e.instance_count !== 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Status: <span className="font-semibold">{e.status}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => togglePublish(e.id, e.status)}
                    className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                      e.status === "published"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {e.status === "published" ? "Published" : "Draft"}
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(e.id, e.title)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          />
        </div>

        <EventForm onSuccess={loadEvents} />
      </div>
    </div>
  );
}
