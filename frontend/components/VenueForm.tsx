"use client";

import { useEffect, useState } from "react";
import { getAdmin, postAdmin } from "@/lib/api";

export default function VenueForm({ onSuccess }: any) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cityId, setCityId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getAdmin("cities").then(setCities);
  }, []);

  const handleSubmit = async () => {
    if (!name || !cityId) {
      alert("Name and City are required");
      return;
    }

    const res = await postAdmin("venues", {
      name,
      address,
      city_id: cityId,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      capacity: capacity ? Number(capacity) : null,
    });

    if (res.message) {
      alert(res.message);
    } else {
      setName("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      setCapacity("");
      onSuccess();
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Add Venue</h2>

      <input
        placeholder="Venue name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <select
        value={cityId}
        onChange={(e) => setCityId(e.target.value)}
        className="border p-2 w-full mb-2"
      >
        <option value="">Select City *</option>
        {cities.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        placeholder="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2"
      >
        Add Venue
      </button>
    </div>
  );
}