"use client";

import { useEffect, useState } from "react";
import { getAdmin, postAdmin } from "@/lib/api";
import SearchableSelect from "./SearchableSelect";
import MultiSelect from "./MultiSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EventInstance {
  venue_id: string | { name: string; address?: string };
  start_at: Date;
  end_at?: Date;
}

interface SelectedItem {
  id?: string;
  name: string;
  isNew?: boolean;
  bio?: string;
  website?: string;
}

export default function EventForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [categories, setCategories] = useState([]);
  const [performers, setPerformers] = useState<SelectedItem[]>([]);
  const [organizers, setOrganizers] = useState<SelectedItem[]>([]);
  const [mediaUrl, setMediaUrl] = useState("");
  const [instances, setInstances] = useState<EventInstance[]>([
    { venue_id: "", start_at: new Date(), end_at: undefined },
  ]);
  const [loading, setLoading] = useState(false);

  const handleAddInstance = () => {
    setInstances([
      ...instances,
      { venue_id: "", start_at: new Date(), end_at: undefined },
    ]);
  };

  const handleRemoveInstance = (idx: number) => {
    setInstances(instances.filter((_, i) => i !== idx));
  };

  const handleInstanceVenueChange = (idx: number, venue: any) => {
    const newInstances = [...instances];
    newInstances[idx].venue_id = venue
      ? { name: venue.name, address: venue.address }
      : "";
    setInstances(newInstances);
  };

  const handleInstanceVenueCreate = (idx: number, name: string) => {
    const newInstances = [...instances];
    newInstances[idx].venue_id = { name, address: "" };
    setInstances(newInstances);
  };

  const handleInstanceStartChange = (idx: number, date: Date) => {
    const newInstances = [...instances];
    newInstances[idx].start_at = date;
    setInstances(newInstances);
  };

  const handleInstanceEndChange = (idx: number, date: Date) => {
    const newInstances = [...instances];
    newInstances[idx].end_at = date;
    setInstances(newInstances);
  };

  const handleSubmit = async () => {
    if (!title || !selectedCity) {
      alert("Title and city are required");
      return;
    }

    if (instances.some((inst) => !inst.venue_id || !inst.start_at)) {
      alert("All instances must have a venue and start time");
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        title,
        description,
        city_id: selectedCity.id,
        instances: instances.map((inst) => ({
          venue_id: inst.venue_id,
          start_at: inst.start_at.toISOString(),
          end_at: inst.end_at?.toISOString(),
        })),
        performers: performers.map((p) => ({
          id: p.id,
          name: p.name,
          bio: p.bio,
        })),
        organizers: organizers.map((o) => ({
          id: o.id,
          name: o.name,
          website: o.website,
        })),
        categories: categories,
        media: mediaUrl ? [{ media_url: mediaUrl, is_hero: true }] : [],
      };

      const res = await postAdmin("events", eventData);

      if (res.message && res.message.includes("already exists")) {
        alert(res.message);
      } else if (res.id) {
        alert("Event created successfully!");
        console.log("Event created with ID:", res.id);
        setTitle("");
        setDescription("");
        setSelectedCity(null);
        setCategories([]);
        setPerformers([]);
        setOrganizers([]);
        setMediaUrl("");
        setInstances([
          { venue_id: "", start_at: new Date(), end_at: undefined },
        ]);
        console.log("Calling onSuccess callback");
        onSuccess();
      } else {
        console.log("Response:", res);
        alert("Error: " + (res.error || res.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Event</h2>

      <input
        placeholder="Event Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-4 min-h-[100px]"
      />

      <SearchableSelect
        label="City *"
        endpoint="cities"
        selectedId={selectedCity?.id}
        onSelect={setSelectedCity}
        allowCreate={false}
        placeholder="Select a city"
      />

      <MultiSelect
        label="Categories"
        endpoint="categories"
        onSelectionChange={(items) =>
          setCategories(items.map((item) => item.id).filter(Boolean))
        }
      />

      <MultiSelect
        label="Performers"
        endpoint="performers"
        onSelectionChange={setPerformers}
        allowCreate={true}
        placeholder="Search or add performers..."
      />

      <MultiSelect
        label="Organizers"
        endpoint="organizers"
        onSelectionChange={setOrganizers}
        allowCreate={true}
        placeholder="Search or add organizers..."
      />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Event Instances *</label>
        {instances.map((instance, idx) => (
          <div key={idx} className="border p-3 mb-3 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Instance {idx + 1}</h4>
              {instances.length > 1 && (
                <button
                  onClick={() => handleRemoveInstance(idx)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  Remove
                </button>
              )}
            </div>

            <SearchableSelect
              label="Venue *"
              endpoint="venues"
              selectedId={
                typeof instance.venue_id === "object"
                  ? undefined
                  : instance.venue_id
              }
              onSelect={(venue) => handleInstanceVenueChange(idx, venue)}
              onCreateNew={(name) => handleInstanceVenueCreate(idx, name)}
              allowCreate={true}
              placeholder="Select or create venue"
              filterText={(v) => `${v.name} (${v.city_name || ""})`}
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date & Time *
                </label>
                <DatePicker
                  selected={instance.start_at}
                  onChange={(date) =>
                    handleInstanceStartChange(idx, date || new Date())
                  }
                  showTimeSelect
                  timeIntervals={30}
                  dateFormat="MMM dd, yyyy h:mm aa"
                  className="border p-2 w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date & Time
                </label>
                <DatePicker
                  selected={instance.end_at}
                  onChange={(date) =>
                    date && handleInstanceEndChange(idx, date)
                  }
                  showTimeSelect
                  timeIntervals={30}
                  dateFormat="MMM dd, yyyy h:mm aa"
                  className="border p-2 w-full"
                  placeholderText="Optional"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddInstance}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Instance
        </button>
      </div>

      <input
        placeholder="Event Image URL"
        value={mediaUrl}
        onChange={(e) => setMediaUrl(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 w-full hover:bg-gray-800 disabled:bg-gray-400"
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
    </div>
  );
}
