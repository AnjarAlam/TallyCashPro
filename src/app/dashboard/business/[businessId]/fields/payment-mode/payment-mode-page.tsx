"use client";

import { PaymentModeList } from "@/components/dashboard/paymentmode/payment-mode-list";
import { PaymentModeSheet } from "@/components/sheets";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

export default function PaymentModesPage({
  businessId,
}: {
  businessId: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get initial status filter from URL
  const initialStatus = searchParams.get("status") as
    | "active"
    | "inactive"
    | undefined;

  // State for filters
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "active" | "inactive" | undefined
  >(initialStatus);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (statusFilter) {
      params.set("status", statusFilter);
    } else {
      params.delete("status");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [statusFilter, pathname, router]);

  // Handle status filter changes
  const handleStatusChange = (value: string) => {
    const newValue = value as "active" | "inactive" | "all";
    setStatusFilter(newValue === "all" ? undefined : newValue);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold">Payment Modes</h1>
        <div className="flex items-center space-x-2">
          <PaymentModeSheet businessId={businessId} />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Search payment modes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="max-w-sm"
          />

          <Select
            value={statusFilter || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tab-based filter (alternative) */}
        <Tabs
          value={statusFilter || "all"}
          onValueChange={handleStatusChange}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Payment Modes List */}
      <PaymentModeList businessId={businessId} statusFilter={statusFilter} />
    </div>
  );
}
