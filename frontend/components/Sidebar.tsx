"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-black text-white p-4 h-screen">

      <ul className="space-y-4">
        <li>
          <Link href="/admin">Admin Dashboard</Link>
        </li>
        <li>
          <Link href="/admin/event">Events</Link>
        </li>
        <li>
          <Link href="/admin/city">Cities</Link>
        </li>

        <li>
          <Link href="/admin/venue">Venues</Link>
        </li>

        <li>
          <Link href="/admin/categories">Categories</Link>
        </li>

        <li>
          <Link href="/admin/tags">Tags</Link>
        </li>

        <li>
          <Link href="/admin/performers">Performers</Link>
        </li>

        <li>
          <Link href="/admin/organizers">Organizers</Link>
        </li>

        <li>
          <Link href="/admin/ticket-sellers">Ticket Sellers</Link>
        </li>
      </ul>
    </div>
  );
}