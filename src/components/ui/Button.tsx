import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | "subtle";
    size?: "default" | "sm" | "lg" | "xl" | "icon";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
        return (
            <button
                className={cn(
                    // Base styles
                    "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "active:scale-[0.98]",
                    // Variants
                    {
                        // Primary (default)
                        "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-md": 
                            variant === "default",
                        // Gradient
                        "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-md hover:shadow-lg hover:shadow-primary/25": 
                            variant === "gradient",
                        // Destructive
                        "bg-error text-white hover:bg-error/90 shadow-sm": 
                            variant === "destructive",
                        // Outline
                        "border border-border bg-transparent hover:bg-secondary hover:border-border-hover text-foreground": 
                            variant === "outline",
                        // Secondary
                        "bg-secondary text-secondary-foreground hover:bg-secondary-hover": 
                            variant === "secondary",
                        // Subtle
                        "bg-primary/10 text-primary hover:bg-primary/20": 
                            variant === "subtle",
                        // Ghost
                        "bg-transparent hover:bg-secondary text-foreground-secondary hover:text-foreground": 
                            variant === "ghost",
                        // Link
                        "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto": 
                            variant === "link",
                    },
                    // Sizes
                    {
                        "h-10 px-4 py-2 text-sm rounded-lg": size === "default",
                        "h-8 px-3 text-xs rounded-md": size === "sm",
                        "h-11 px-6 text-sm rounded-lg": size === "lg",
                        "h-12 px-8 text-base rounded-xl": size === "xl",
                        "h-10 w-10 p-0 rounded-lg": size === "icon",
                    },
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="opacity-70">{children}</span>
                    </>
                ) : (
                    <>
                        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
