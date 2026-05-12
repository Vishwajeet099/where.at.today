"use client";

import { useState } from "react";
import { postAdmin } from "@/lib/api";

export default function GenericForm({
  endpoint,
  fields,
  onSuccess,
}: any) {
  const [form, setForm] = useState<any>({});

  const handleSubmit = async () => {
    if (!form.name) {
      alert("Name is required");
      return;
    }

    const res = await postAdmin(endpoint, form);

    if (res.message) {
      alert(res.message);
    } else {
      setForm({});
      onSuccess();
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Add New</h2>

      <input
        placeholder="Name *"
        value={form.name || ""}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        className="border p-2 w-full mb-2"
      />

      {fields.map((f: any) => (
        <input
          key={f}
          placeholder={f}
          value={form[f] || ""}
          onChange={(e) =>
            setForm({ ...form, [f]: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2"
      >
        Add
      </button>
    </div>
  );
}