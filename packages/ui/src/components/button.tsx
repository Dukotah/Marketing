import * as React from "react";
import { cn } from "../utils.js";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const variantClasses = {
  default: "bg-blue-600 text-white hover:bg-blue-500 shadow",
  destructive: "bg-red-600 text-white hover:bg-red-500 shadow-sm",
  outline: "border border-neutral-700 bg-transparent hover:bg-neutral-800 text-neutral-200",
  secondary: "bg-neutral-800 text-neutral-200 hover:bg-neutral-700 shadow-sm",
  ghost: "hover:bg-neutral-800 hover:text-neutral-100 text-neutral-400",
  link: "text-blue-500 underline-offset-4 hover:underline",
};

const sizeClasses = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-11 rounded-md px-8 text-base",
  icon: "h-9 w-9",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
