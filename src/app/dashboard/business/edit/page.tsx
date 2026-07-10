"use client";

import { PreviousPage } from "@/components/navigation";
import React from "react";
// update the path based on your structure

export default function Page() {
  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-3xl mx-auto  p-8 relative">
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <PreviousPage />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Edit Business
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Fill out the details below to get started
        </p>

        {/* Placeholder for your form or inputs */}
        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400">
          {/* Replace this with actual form fields */}
          Business form goes here...
        </div>
      </div>
    </div>
  );
}
