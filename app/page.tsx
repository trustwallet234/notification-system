"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function HomePage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsubscribe();
  }, []);

  // ✅ Filtered based on search input (fixed with safe check)
  const filtered = notifications.filter((n) =>
    (n.title ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-black-700">
        📢 Latest Unidel schedule
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search schedule..."
        className="border rounded-full p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8 transition"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-gray-500 text-center">
            No matching notifications found.
          </p>
        )}

        {filtered.map((n) => (
          <Link
            key={n.id}
            href={`/notification/${n.id}`}
            className="block border p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition duration-300 hover:bg-blue-50"
          >
            <h2 className="text-xl font-semibold text-gray-800">{n.title ?? "Untitled"}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {n.createdAt?.seconds
                ? new Date(n.createdAt.seconds * 1000).toLocaleString()
                : "Unknown date"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
