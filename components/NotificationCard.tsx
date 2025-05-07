import Link from "next/link";

type Props = {
  id: string;
  title: string;
  createdAt: string;
};

export default function NotificationCard({ id, title, createdAt }: Props) {
  return (
    <Link href={`/notification/${id}`}>
      <div className="border p-4 rounded-lg bg-white shadow hover:shadow-md transition">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{createdAt}</p>
      </div>
    </Link>
  );
}
