"use client";

import * as React from "react";
import { Building, ChevronDown, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Business {
  id: string;
  name: string;
}

interface BusinessSwitcherProps {
  currentBusiness: Business;
  businesses: Business[];
  onSelectBusiness: (businessId: string) => void;
  onAddNewBusiness: () => void;
}

export function BusinessSwitcher({
  currentBusiness,
  businesses,
  onSelectBusiness,
  onAddNewBusiness,
}: BusinessSwitcherProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="lg:flex hidden items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-transparent"
        >
          <Building className="h-4 w-4 text-gray-500" />
          <span className="truncate max-w-[180px]">{currentBusiness.name}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="start">
        <DropdownMenuLabel className="sr-only">
          Select Business
        </DropdownMenuLabel>
        <div className="p-1">
          <Input
            placeholder="Search Business"
            className="w-full h-9 border-blue-500 focus:border-blue-500 focus-visible:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // icon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <DropdownMenuSeparator />
        <RadioGroup
          value={currentBusiness.id}
          onValueChange={onSelectBusiness}
          className="grid gap-1 p-1"
        >
          {filteredBusinesses.map((business) => (
            <DropdownMenuItem
              key={business.id}
              onSelect={(e) => e.preventDefault()}
              className="p-0"
            >
              <Label
                htmlFor={`business-${business.id}`}
                className="flex items-center gap-2 w-full cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <RadioGroupItem
                  value={business.id}
                  id={`business-${business.id}`}
                  className="h-4 w-4"
                />
                {business.name}
              </Label>
            </DropdownMenuItem>
          ))}
        </RadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onAddNewBusiness} className="p-0">
          <Button
            variant="default"
            className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Add New Business
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
