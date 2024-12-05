"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg md:text-xl text-center mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        onClick={() => router.push("/")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Go to Home
      </Button>
    </div>
  );
}
