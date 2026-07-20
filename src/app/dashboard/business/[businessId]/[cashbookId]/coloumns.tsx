"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { TransferConversionBadge } from "@/components/transactions/transfer-conversion-badge";
import { Transaction } from "@/interface";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
      // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date & Time
        {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const time = row.original.time || format(date, "hh:mm a");
      return (
        <div className="flex flex-col px-3">
          <span>{format(date, "dd MMM, yyyy")}</span>
          <span className="text-muted-foreground text-xs">{time}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "party",
    enableSorting: false,
    header: "Details",
    cell: ({ row }) => {
      const category =
        row.original.categoryDetails?.name || row.original.categoryName || row.original.category;
      return (
        <div className="flex flex-col gap-1 min-w-0">
          {category && (
            <span className="text-sm font-medium text-gray-900 line-clamp-2">
              {category}
            </span>
          )}
          <TransferConversionBadge transaction={row.original} />
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    enableSorting: false,
    header: "Category",
    cell: ({ row }) => {
      const category =
        row.original.categoryDetails?.name || row.original.categoryName || row.original.category;
      return <div className="capitalize">{category || "--"}</div>;
    },
  },
  {
    accessorKey: "paymentMode",
    enableSorting: false,
    header: "Mode",
    cell: ({ row }) => {
      const paymentMode =
        row.original.paymentModeDetails?.name || row.original.paymentModeName || row.original.paymentMode;
      return <div className="capitalize">{paymentMode}</div>;
    },
  },
  {
    accessorKey: "amount",
    enableSorting: true,
    header: () => <div className="text-left">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.original.type;
      return (
        <div
          className={`text-left font-medium ${type === "cash_in" ? "text-green-600" : "text-red-600"
            }`}
        >
          {type === "cash_in" ? "+" : "-"}
          {amount.toLocaleString()}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "balance",
  //   enableSorting: false,
  //   header: () => <div className="text-left">Balance</div>,
  //   cell: ({ row }) => {
  //     const balance = parseFloat(row.getValue("balance") || "0");
  //     return (
  //       <div className="text-left font-medium">{balance.toLocaleString()}</div>
  //     );
  //   },
  // },
  {
    id: "attachments",
    enableSorting: false,
    header: "Attachments",
    cell: ({ row }) => {
      const attachments = row.original.attachments;
      if (!attachments || attachments.length === 0) {
        return <div className="text-muted-foreground">--</div>;
      }
      return (
        <div className="flex space-x-1">
          {attachments.map((attachment) => (
            <Link
              key={attachment._id}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FileText className="h-4 w-4" />
                <span className="sr-only">{attachment.key}</span>
              </Button>
            </Link>
          ))}
        </div>
      );
    },
  },
];
