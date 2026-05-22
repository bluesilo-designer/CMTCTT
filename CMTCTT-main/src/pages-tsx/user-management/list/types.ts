import type { UserRoleType } from "@/data/userManagement";

export type TabType = "Overall" | UserRoleType | "Archived";

export interface UserListProps {
  onNavigate?: (path: string) => void;
}

export interface AddUserDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface UserRowMenuProps {
  onEdit: () => void;
  onArchive: () => void;
  onResetPassword: () => void;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
}

export interface AccountStatusBadgeProps {
  status: import("@/data/userManagement").AccountStatus;
}
