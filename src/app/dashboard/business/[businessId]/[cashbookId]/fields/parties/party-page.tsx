"use client";

import { PartyListSection } from "@/components/dashboard";
import { PartySheet } from "@/components/sheets";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PartiesPage() {
  const { user, loading } = useAuth();
  const { cashbookId } = useParams<{ cashbookId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get initial values from URL search params
  const initialSearch = searchParams.get("search") || "";
  const initialType = searchParams.get("type") as
    | "Customer"
    | "Supplier"
    | undefined;
  const initialStatus = searchParams.get("status") as
    | "active"
    | "inactive"
    | undefined;

  // State for controlled inputs
  const [searchValue, setSearchValue] = useState(initialSearch);
  const debouncedSearchQuery = useDebounce(searchValue, 300);
  const [typeFilter, setTypeFilter] = useState<
    "Customer" | "Supplier" | undefined
  >(initialType);
  const [statusFilter, setStatusFilter] = useState<
    "active" | "inactive" | undefined
  >(initialStatus);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearchQuery) {
      params.set("search", debouncedSearchQuery);
    }

    if (typeFilter) {
      params.set("type", typeFilter);
    }

    if (statusFilter) {
      params.set("status", statusFilter);
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    }
  }, [
    debouncedSearchQuery,
    typeFilter,
    statusFilter,
    pathname,
    router,
    searchParams,
  ]);

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
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h1 className="text-2xl font-bold">Parties</h1>
          <div className="flex items-center space-x-2">
            <PartySheet bookId={cashbookId} />
          </div>
        </div>

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
          </div>

          {/* Alternative tab-based filter (optional) */}
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

        {/* Party List */}
        <PartyListSection
          bookId={cashbookId}
          searchQuery={debouncedSearchQuery}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
        />
      </div>
    );
  if (loading) return "Loading...";
}
