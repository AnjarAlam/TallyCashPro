"use client";

import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const sampleData = [
  {
    dateTime: "June 25, 2026",
    detail: "Invoice #011 - Jun 2026",
    category: "Basic",
    mode: "Online",
    status: "In",
    amount: "$25.00",
    attachment: "/images/web.png",
  },
  {
    dateTime: "May 15, 2025",
    detail: "Invoice #010 - May 2025",
    category: "Premium",
    mode: "Cash",
    status: "Out",
    amount: "$35.00",
    attachment: "/images/appstore.png",
  },
];

export default function BillingRowCards() {
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(
    null
  );
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

      {/* Headings */}
      <div className="grid grid-cols-8 gap-4 px-4 text-sm text-gray-600 font-semibold border-b pb-2">
        <div>Date & Time</div>
        <div>Category</div>
        <div>Mode</div>
        <div>Status</div>
        <div>Amount</div>
        <div>Attachment</div>
        <div className="col-span-2">Details</div>
      </div>

      {/* Data Rows */}
      {sampleData.map((entry, index) => (
        <div
          key={index}
          className="grid grid-cols-8 gap-4 items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
        >
          <div className="text-sm text-gray-800">{entry.dateTime}</div>
          <div className="text-sm text-gray-800">{entry.category}</div>
          <div>
            <Badge
              className={
                entry.mode === "Online"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {entry.mode}
            </Badge>
          </div>
          <div>
            <Badge
              className={
                entry.status === "In"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {entry.status}
            </Badge>
          </div>
          <div className="text-sm text-gray-800">{entry.amount}</div>

          {/* Attachment Dialog */}
          <div>
            {entry.attachment && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAttachment(entry.attachment)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Attachment Preview</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-4 w-full">
                    <img
                      src={selectedAttachment || ""}
                      alt="Attachment"
                      className="rounded-lg max-h-[400px]"
                    />
                    <div className="w-full flex justify-end">
                      <a
                        href={selectedAttachment || "#"}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="default">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </a>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Detail Dialog */}
          <div className="col-span-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDetail(entry.detail)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Details</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-700">{selectedDetail}</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  );
}
