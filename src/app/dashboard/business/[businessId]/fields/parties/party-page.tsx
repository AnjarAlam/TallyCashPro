"use client";

import { useAuth } from "@/hooks";

export default function PartiesPage() {
  const { user, loading } = useAuth();

  if (loading) return "Loading...";

  if (!user) return null;

  return (
    <div className="space-y-4 py-8 text-center text-gray-600">
      <h1 className="text-2xl font-bold text-gray-900">Parties</h1>
      <p>
        Parties are managed per cashbook. Open a cashbook, go to Settings, and
        choose Parties to add or edit parties for that book.
      </p>
    </div>
  );
}
