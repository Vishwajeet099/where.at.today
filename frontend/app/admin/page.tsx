"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function AdminDashboard() {
  const sections = [
    { name: "Cities", path: "/admin/city" },
    { name: "Venues", path: "/admin/venue" },
    { name: "Events", path: "/admin/event" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Performers", path: "/admin/performers"},
    { name: "Tags", path: "/admin/tags"},
    { name: "Organizers", path: "/admin/organizers"},
    { name: "Ticket Sellers", path: "/admin/ticket-sellers"},

  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-3 gap-6">
          {sections.map((sec) => (
            <Link
              key={sec.name}
              href={sec.path}
              className="border p-6 rounded-lg text-white hover:bg-gray-100 cursor-pointer hover:text-black"
            >
              <h2 className="text-lg font-semibold">{sec.name}</h2>
              <p className="text-sm text-gray-500">
                Manage {sec.name.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}