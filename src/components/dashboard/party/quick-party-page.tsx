"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QuickPartyListSection } from "./quick-party-list";
import { PartySheet } from "@/components/sheets";

export function QuickPartiesPage({
  bookId,
  onValueChange,
}: {
  bookId: string;
  onValueChange: (e: any) => void;
}) {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get initial values from URL search params
  const initialSearch = searchParams.get("search") || "";
  const initialType = searchParams.get("type") as
    | "Customer"
    | "Supplier"
    | undefined;
  //   const initialStatus = searchParams.get("status") as
  //     | "active"
  //     | "inactive"
  //     | undefined;

  // State for controlled inputs
  const [searchValue, setSearchValue] = useState(initialSearch);
  const debouncedSearchQuery = useDebounce(searchValue, 300);
  const [typeFilter, setTypeFilter] = useState<
    "Customer" | "Supplier" | undefined
  >(initialType);
  const [statusFilter, setStatusFilter] = useState<
    "active" | "inactive" | undefined
  >("active");

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearchQuery) {
      params.set("search", debouncedSearchQuery);
    } else {
      params.delete("search");
    }

    if (typeFilter) {
      params.set("type", typeFilter);
    } else {
      params.delete("type");
    }

    if (statusFilter) {
      params.set("status", statusFilter);
    } else {
      params.delete("status");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchQuery, typeFilter, statusFilter, pathname, router]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Handle type filter changes
  const handleTypeChange = (value: string) => {
    const newValue = value as "Customer" | "Supplier" | "all";
    setTypeFilter(newValue === "all" ? undefined : newValue);
  };

  // Handle status filter changes
  const handleStatusChange = (value: string) => {
    const newValue = value as "active" | "inactive" | "all";
    setStatusFilter(newValue === "all" ? undefined : newValue);
  };

  if (!loading && user)
    return (
      <div className="space-y-6 px-4">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              placeholder="Search parties..."
              value={searchValue}
              onChange={handleSearchChange}
              className="max-w-sm"
            />

            <div className="flex gap-2">
              <Select
                value={typeFilter || "all"}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>

              {/* <Select
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
              </Select> */}
            </div>
          </div>

          {/* Alternative tab-based filter (optional) */}
          {/* <Tabs
            value={statusFilter || "all"}
            onValueChange={handleStatusChange}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs> */}
        </div>

        {/* Party List */}
        <QuickPartyListSection
          bookId={bookId}
          onValueChange={onValueChange}
          searchQuery={debouncedSearchQuery}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
        />
        <div className="absolute bottom-4 right-4">
          <PartySheet bookId={bookId} />
        </div>
      </div>
    );
  if (loading) return "Loading...";
}
