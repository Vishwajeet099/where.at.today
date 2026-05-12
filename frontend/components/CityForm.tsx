"use client";

import { useState } from "react";
import { postAdmin } from "@/lib/api";

export default function CityForm({ onSuccess }: any) {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    const res = await postAdmin("cities", { name });

    if (res.message) {
      alert(res.message);
    } else {
      setName("");
      onSuccess();
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Add City</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="City name"
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2"
      >
        Add
      </button>
    </div>
  );
}