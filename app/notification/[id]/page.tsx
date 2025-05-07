import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  params: { id: string };
};

async function getNotification(id: string) {
  const docRef = doc(db, "notifications", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as any;
  } else {
    return null;
  }
}

export default async function NotificationPage({ params }: Props) {
  const notification = await getNotification(params.id);

  if (!notification) {
    return <p className="p-4">Notification not found.</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900">
      <h1 className="text-3xl font-bold mb-2">{notification.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(notification.createdAt.seconds * 1000).toLocaleString()}
      </p>
      <p className="text-lg">{notification.content}</p>
    </main>
  );
}
