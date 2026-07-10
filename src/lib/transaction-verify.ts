import type { TransactionUserRef } from "@/interface/transaction";
import type { UserRoles } from "@/interface";

export function getTransactionUserName(
  user?: TransactionUserRef | string | null
): string {
  if (!user || typeof user === "string") return "";
  return user.name?.trim() || user.email?.trim() || "";
}

export function canVerifyTransactions(userRoles: UserRoles): boolean {
  const { businessRole, cashbookRole } = userRoles;
  if (businessRole === "owner") return true;
  const bookRole = cashbookRole as string | undefined;
  if (bookRole === "admin" || bookRole === "owner") return true;
  return false;
}
