import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomCheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}

export function CustomCheckbox({ checked, disabled, onChange }: CustomCheckboxProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={cn(
        "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors",
        disabled
          ? "bg-gray-100 border-gray-200 cursor-not-allowed"
          : checked
          ? "bg-brand-primary border-brand-primary hover:bg-brand-primary-hover"
          : "bg-white border-gray-300 hover:border-brand-primary"
      )}
    >
      {checked && <Check size={11} className="text-white" strokeWidth={3} />}
    </button>
  );
}
