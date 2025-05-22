"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Listen to notifications
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return;

    await addDoc(collection(db, "notifications"), {
      title,
      content,
      createdAt: Timestamp.now(),
    });

    setTitle("");
    setContent("");
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "notifications", id));
  }

  async function handleLogout() {
    await signOut(auth);
    router.push("/admin/login");
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          className="border p-2 w-full"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create schedule
        </button>
      </form>

      {/* Notifications List */}
      <h2 className="text-2xl font-semibold mb-2">Existing schedule</h2>
      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="border p-4 rounded bg-white shadow flex justify-between"
          >
            <div>
              <h3 className="font-semibold text-sm text-black">{n.title}</h3>
              <p className="text-sm text-black">
                {new Date(n.createdAt.seconds * 1000).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(n.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
