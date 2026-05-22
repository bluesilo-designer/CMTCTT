import React from "react";
import { cn } from "@/lib/utils";

// 1. Basic Input Component (from index.js)
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Custom props can go here
}

export const InputCustom = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn("focus:outline-none p-3 border-2 rounded-lg", className)}
        {...props}
      />
    );
  }
);
InputCustom.displayName = "InputCustom";

// 2. Formik-aware Input Component (from inputText.js)
// Use this inside <Formik> forms.
export interface InputTextComponentProps {
  formik?: any; // Formik props
  name: string;
  placeholder?: string;
  type?: string;
  isContactNo?: boolean;
  countryCode?: string;
  maxLength?: number;
  className?: string;
}

export const InputTextComponent = ({
  formik,
  name,
  placeholder = "",
  type = "text",
  isContactNo = false,
  countryCode = "+65",
  maxLength,
  className,
}: InputTextComponentProps) => {
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(" ");
    }
    return value;
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isContactNo) {
      const formatted = formatPhoneNumber(e.target.value);
      formik?.setFieldValue(name, formatted);
    } else {
      formik?.handleChange(e);
    }
  };

  const hasError = formik?.touched[name] && formik?.errors[name];

  if (isContactNo) {
    return (
      <div className={className}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-[12px] pointer-events-none">
            <span className="text-[#525252] text-base font-medium">
              {countryCode}
            </span>
            <div className="h-6 w-px bg-[#D0D5DD] mx-3"></div>
          </div>
          <input
            id={name}
            name={name}
            onChange={handleContactChange}
            value={formik?.values[name] || ""}
            onBlur={formik?.handleBlur}
            type="text"
            placeholder={placeholder || "7664 1237 2348"}
            maxLength={maxLength}
            className={cn(
              "block font-medium w-full rounded-lg bg-transparent pl-[70px] pr-[12px] h-[44px] text-base text-[#101828] border",
              hasError ? "border-red-500" : "border-[#D0D5DD]",
              "placeholder:text-[#525252] placeholder:text-base placeholder:font-normal focus:border-[#101828] focus:ring-0 hover:border-[#101828]"
            )}
          />
        </div>
        {hasError && (
          <div className="text-red-500 text-xs pt-1 pl-1">
            {formik?.errors[name] as string}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        id={name}
        name={name}
        onChange={formik?.handleChange}
        value={formik?.values[name] || ""}
        onBlur={formik?.handleBlur}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          "block font-medium w-full rounded-lg bg-transparent px-[12px] h-[44px] text-base text-[#101828] border",
          hasError ? "border-red-500" : "border-[#D0D5DD]",
          "placeholder:text-[#525252] placeholder:text-base placeholder:font-normal focus:border-[#101828] focus:ring-0 hover:border-[#101828]"
        )}
      />
      {hasError && (
        <div className="text-red-500 text-xs pt-1 pl-1">
          {formik?.errors[name] as string}
        </div>
      )}
    </div>
  );
};
