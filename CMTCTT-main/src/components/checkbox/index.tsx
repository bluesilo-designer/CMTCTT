import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  ariaDescribedBy?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  size?: number;
}

export const Checkbox = ({
  id = "checkbox",
  name = "checkbox",
  checked,
  indeterminate = false,
  disabled = false,
  ariaDescribedBy,
  onChange,
  className = "",
  size = 20,
}: CheckboxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div
      className="group grid grid-cols-1"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
        onChange={handleChange}
        ref={(el) => {
          if (el) {
            el.indeterminate = indeterminate;
          }
        }}
        className={cn(
          "col-start-1 row-start-1 appearance-none rounded border border-[#D0D5DD] bg-white cursor-pointer",
          "checked:border-[#912018] checked:bg-[#FEF3F2]",
          "indeterminate:border-gray-500 indeterminate:bg-gray-500",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500",
          "disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 disabled:cursor-not-allowed",
          "transition-colors",
          className
        )}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
      <svg
        fill="none"
        viewBox="0 0 14 14"
        style={{ width: `${size}px`, height: `${size}px` }}
        className="pointer-events-none col-start-1 row-start-1 self-center justify-self-center stroke-[#912018] group-has-[:disabled]:stroke-gray-400"
      >
        {/* Checkmark for checked state */}
        <path
          d="M3 8L6 11L11 3.5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-0 group-has-[:checked]:opacity-100 transition-opacity"
        />
        {/* Horizontal line for indeterminate state */}
        <path
          d="M3 7H11"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-0 group-has-[:indeterminate]:opacity-100 transition-opacity"
        />
      </svg>
    </div>
  );
};
