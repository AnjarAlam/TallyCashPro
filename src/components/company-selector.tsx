// components/company-selector.tsx
"use client"

import { useState, useEffect } from "react"
import { Search, Check, Building2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface Company {
  _id: string
  name: string
  email?: string
  logo?: string
}

interface CompanySelectorProps {
  companies: Company[]
  onSelect: (companyId: string) => void
  selectedCompanyId?: string
  isLoading?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
}

export function CompanySelector({
  companies,
  onSelect,
  selectedCompanyId,
  isLoading = false,
  searchPlaceholder = "Search companies...",
  emptyMessage = "No companies found",
}: CompanySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Debug logging
  useEffect(() => {
    console.log("🔍 CompanySelector Debug:", {
      totalCompanies: companies.length,
      companies: companies.map(c => ({ id: c._id, name: c.name })),
      isLoading,
      searchQuery
    })
  }, [companies, isLoading, searchQuery])

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Skeleton className="h-10 w-full pl-9" />
        </div>
        <div className="h-[300px] space-y-2 rounded-md border p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Debug info for empty companies */}
      {companies.length === 0 && !isLoading && process.env.NODE_ENV === "development" && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-sm">
            <strong>Warning:</strong> Received empty companies array. Check the data source.
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Company List */}
      <div className="h-[300px] overflow-y-auto rounded-md border">
        {filteredCompanies.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8">
            <Building2 className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-center">
              {searchQuery ? "No companies match your search" : emptyMessage}
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-400 mt-2">
                Try a different search term
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            <div className="px-2 py-1 text-xs font-medium text-gray-500">
              {filteredCompanies.length} {filteredCompanies.length === 1 ? "company" : "companies"} found
            </div>
            {filteredCompanies.map((company) => (
              <button
                key={company._id}
                onClick={() => {
                  console.log("Selected company:", company)
                  onSelect(company._id)
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md p-3 text-left transition-all duration-200",
                  "hover:bg-blue-50 hover:border hover:border-blue-100 dark:hover:bg-blue-900/20",
                  selectedCompanyId === company._id
                    ? "bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700"
                    : "border border-transparent"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-10 w-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                      <span className="text-sm font-bold text-white">
                        {company.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {company.name}
                    </p>
                    {company.email && (
                      <p className="text-sm text-gray-500 truncate">
                        {company.email}
                      </p>
                    )}
                  </div>
                </div>

                {selectedCompanyId === company._id && (
                  <div className="ml-2 flex-shrink-0">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}