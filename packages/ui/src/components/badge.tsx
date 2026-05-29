import * as React from "react";
import { cn } from "../utils.js";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

const variantClasses = {
  default: "bg-blue-600 text-white",
  secondary: "bg-neutral-800 text-neutral-300",
  destructive: "bg-red-900/50 text-red-400 border border-red-800",
  outline: "border border-neutral-700 text-neutral-300",
  success: "bg-green-900/50 text-green-400 border border-green-800",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
