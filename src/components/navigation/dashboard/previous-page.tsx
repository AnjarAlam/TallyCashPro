"use client"; // Required for using useRouter in client components

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {};

function PreviousPage({}: Props) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant={"secondary"}
      size={"icon"}
      className=""
    >
      <ArrowLeft />
    </Button>
  );
}

export default PreviousPage;
