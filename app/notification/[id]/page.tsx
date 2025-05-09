import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Notification = {
  title: string;
  content: string;
  createdAt: { seconds: number };
};

export default async function NotificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ Await params

  // Fetch data from Firestore
  const docRef = doc(db, 'notifications', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return (
      <div className="p-4">
        <p>Notification not found.</p>
      </div>
    );
  }

  const notification = docSnap.data() as Notification;

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
