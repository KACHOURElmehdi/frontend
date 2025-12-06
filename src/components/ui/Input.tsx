import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Search, X } from "lucide-react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    error?: string;
    hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, leftIcon: LeftIcon, rightIcon: RightIcon, error, hint, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {LeftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none">
                        <LeftIcon className="h-4 w-4" />
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-lg border bg-input px-3 py-2 text-sm transition-all duration-200",
                        "placeholder:text-foreground-muted",
                        "hover:border-border-hover",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
                        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                        LeftIcon && "pl-10",
                        RightIcon && "pr-10",
                        error 
                            ? "border-error focus:ring-error/20 focus:border-error" 
                            : "border-input-border",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {RightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none">
                        <RightIcon className="h-4 w-4" />
                    </div>
                )}
                {(error || hint) && (
                    <p className={cn(
                        "mt-1.5 text-xs",
                        error ? "text-error" : "text-foreground-muted"
                    )}>
                        {error || hint}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

// Textarea Component
export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, hint, ...props }, ref) => {
        return (
            <div className="relative w-full">
                <textarea
                    className={cn(
                        "flex min-h-[120px] w-full rounded-lg border bg-input px-3 py-2.5 text-sm transition-all duration-200",
                        "placeholder:text-foreground-muted",
                        "hover:border-border-hover",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
                        "resize-none",
                        error 
                            ? "border-error focus:ring-error/20 focus:border-error" 
                            : "border-input-border",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {(error || hint) && (
                    <p className={cn(
                        "mt-1.5 text-xs",
                        error ? "text-error" : "text-foreground-muted"
                    )}>
                        {error || hint}
                    </p>
                )}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

// Label Component
export interface LabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, children, required, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    "text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    className
                )}
                {...props}
            >
                {children}
                {required && <span className="text-error ml-1">*</span>}
            </label>
        );
    }
);
Label.displayName = "Label";

// Search Input Component
export interface SearchInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, value, onClear, ...props }, ref) => {
        const hasValue = value && String(value).length > 0;
        
        return (
            <div className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none">
                    <Search className="h-4 w-4" />
                </div>
                <input
                    type="search"
                    value={value}
                    className={cn(
                        "flex h-10 w-full rounded-lg border bg-input px-3 py-2 text-sm transition-all duration-200",
                        "placeholder:text-foreground-muted",
                        "hover:border-border-hover",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
                        "pl-10",
                        hasValue && onClear && "pr-10",
                        "border-input-border",
                        "[&::-webkit-search-cancel-button]:hidden",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {hasValue && onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }
);
SearchInput.displayName = "SearchInput";

export { Input, Textarea, Label, SearchInput };
