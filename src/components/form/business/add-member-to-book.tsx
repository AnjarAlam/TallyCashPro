// components/form/business/add-member-to-book.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, Shield } from "lucide-react";

interface AddMemberToBookFormProps {
  bookId: string;
  companyId: string;
  onClose: () => void;
  onSubmit: (email: string, role: string) => void;
  isSubmitting: boolean;
}

export const AddMemberToBookForm = ({
  bookId,
  companyId,
  onClose,
  onSubmit,
  isSubmitting,
}: AddMemberToBookFormProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor" | "viewer" | "accountant">("viewer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && role) {
      onSubmit(email.trim(), role);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="member@example.com"
            className="pl-9"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <p className="text-xs text-gray-500">
          Enter the email address of the member you want to add to this book.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Book Role</Label>
        <Select
          value={role}
          onValueChange={(value: "admin" | "editor" | "viewer" | "accountant") =>
            setRole(value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Admin</span>
              </div>
            </SelectItem>
            <SelectItem value="editor">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Editor</span>
              </div>
            </SelectItem>
            <SelectItem value="viewer">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <span>Viewer</span>
              </div>
            </SelectItem>
            <SelectItem value="accountant">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Accountant</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gray-900 hover:bg-gray-800"
          disabled={isSubmitting || !email.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Member"
          )}
        </Button>
      </div>
    </form>
  );
};