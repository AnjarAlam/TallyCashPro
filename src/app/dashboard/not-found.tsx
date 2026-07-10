// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="text-blue-600 hover:underline text-lg">
        Go back home →
      </Link>
    </div>
  );
}
