"use client";

import { useEffect, useState } from "react";
import { getAdmin } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ListPanel from "@/components/ListPanel";
import GenericForm from "@/components/GenericForm";

interface Tag {
  id: string;
  name: string;
  slug?: string;
}

export default function TagsPage() {
  const [data, setData] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getAdmin("tags");

      console.log("TAGS API RESPONSE:", res);

      // Extract array from any common response shape
      let tags: Tag[] = [];

      if (Array.isArray(res)) {
        tags = res;
      }

      setData(tags);
    } catch (err) {
      console.error("Failed to load tags:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ListPanel
          title="Tags"
          items={data}
          renderItem={(i: Tag) => (
            <div className="flex flex-col">
              <span className="font-medium">{i.name}</span>

              {i.slug && (
                <span className="text-sm text-gray-500">
                  {i.slug}
                </span>
              )}
            </div>
          )}
        />

        <GenericForm
          endpoint="tags"
          fields={[
            {
              name: "slug",
              label: "Slug",
              type: "text",
            },
          ]}
          onSuccess={load}
        />

        {loading && (
          <div className="text-sm text-gray-500">
            Loading tags...
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-sm text-red-500">
            No tags found
          </div>
        )}
      </div>
    </div>
  );
}