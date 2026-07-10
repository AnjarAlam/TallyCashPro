import { hasPermission } from "@/lib/check-permission";
import type { UserRoleByBusiness } from "@/interface";

const BUSINESS_ROLES: UserRoleByBusiness[] = ["owner", "partner", "staff"];

export function normalizeCompanyRole(
  role?: string | null
): UserRoleByBusiness {
  if (role && BUSINESS_ROLES.includes(role as UserRoleByBusiness)) {
    return role as UserRoleByBusiness;
  }
  return "staff";
}

export function formatCompanyRole(role?: string | null): string {
  if (!role) return "—";
  return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ");
}

export function getBusinessSettingsPermissions(companyRole?: string | null) {
  const businessRole = normalizeCompanyRole(companyRole);
  const roleKey = companyRole ?? businessRole;

  const canDelete = hasPermission(
    { businessRole },
    "crud_cashbook",
    "D",
  );
  const canEdit = hasPermission(
    { businessRole },
    "crud_cashbook",
    "U",
  );
  const canReorder = ["owner", "admin"].includes(roleKey);
  const canViewAuditLogs = ["owner", "admin", "manager"].includes(roleKey);
  const canManageTeam = ["owner", "admin", "partner"].includes(roleKey);
  const hasSettingsAccess =
    canEdit || canReorder || canViewAuditLogs || canManageTeam || canDelete;

  return {
    canDelete,
    canEdit,
    canReorder,
    canViewAuditLogs,
    canManageTeam,
    hasSettingsAccess,
  };
}
