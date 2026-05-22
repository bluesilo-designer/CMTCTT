import React from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// TODO: Port HasAccess from imt-fe when RBAC is implemented
// import { HasAccess } from "utils/checkAccess";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: "default" | "outline" | "submit" | "button" | "reset" | any;
  loading?: boolean;
  code?: string;
  method?: string;
}

export const Button = ({
  className,
  children,
  type = "default",
  disabled,
  loading = false,
  code,
  method,
  ...props
}: ButtonProps) => {
  // if (code && method && !HasAccess(code, method)) return null;

  const isTextLeft = className?.includes("text-left");
  
  // Re-map the 'type' prop if it conflicts with standard HTML button type
  const htmlType = type === "submit" ? "submit" : type === "reset" ? "reset" : "button";
  const styleType = type === "submit" || type === "reset" || type === "button" ? "default" : type;

  return (
    <button
      {...props}
      type={htmlType}
      disabled={disabled || loading}
      className={cn(
        "p-3 rounded-md inline-flex items-center gap-2 transition-colors",

        styleType === "default"
          ? cn(
              "bg-gray-500 w-full text-white hover:bg-gray-600",
              isTextLeft ? "justify-start" : "justify-center",
            )
          : "",

        styleType === "outline"
          ? "border-2 text-gray-500 w-full bg-white justify-start hover:bg-gray-50"
          : "",

        className,

        styleType === "default" && disabled ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : "",

        styleType === "outline" && disabled
          ? "border-2 border-slate-100 bg-white cursor-not-allowed hover:bg-white"
          : "",

        loading ? "opacity-90 relative pointer-events-none" : "",
      )}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40">
          <LoaderCircle
            size={18}
            className={cn(
              "animate-spin shrink-0",
              styleType === "default" ? "text-white" : "text-gray-500",
            )}
          />
        </div>
      )}

      {children}
    </button>
  );
};
