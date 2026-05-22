export interface AssignmentSource {
  type: "booking" | "create";
  bookingData?: any;
}

export interface CreateAssignmentFormValues {
  operator: string;
  personnelOperator: string;
  assignmentType: string;
  baseStation: string;
  bookingIds: string[];
}

export interface CreateAssignmentProps {
  onNavigate?: (path: string) => void;
}

export interface FieldDropdownProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  locked?: boolean;
  required?: boolean;
  openDropdown: string | null;
  onToggle: (id: string) => void;
  onSelect: (field: string, value: string) => void;
}

export interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export interface CoursewareModalProps {
  preSelectedBooking: any;
  onConfirm: () => void;
  onClose: () => void;
}

export interface RightPanelProps {
  bookingData: any;
  extractTimeStr: (time: string) => string;
}
