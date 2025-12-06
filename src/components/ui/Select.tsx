'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
    value: string;
    label: React.ReactNode;
    disabled?: boolean;
}

export interface SelectProps {
    options?: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
    children?: React.ReactNode;
}

function Select({ 
    options, 
    value, 
    onChange, 
    placeholder = "Select an option",
    disabled = false,
    error,
    className,
    children
}: SelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const selectRef = React.useRef<HTMLDivElement>(null);

    const optionList = React.useMemo(() => {
        if (options && options.length > 0) {
            return options;
        }

        const derived: SelectOption[] = [];
        React.Children.forEach(children, (child) => {
            if (React.isValidElement<{ value?: string | number; disabled?: boolean; children?: React.ReactNode }>(child) && child.type === "option") {
                const childValue = child.props.value;
                derived.push({
                    value: childValue !== undefined ? String(childValue) : "",
                    label: child.props.children,
                    disabled: child.props.disabled,
                });
            }
        });
        return derived;
    }, [options, children]);

    const normalizedValue = value ?? "";
    const selectedOption = optionList.find(opt => opt.value === normalizedValue);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={selectRef} className={cn("relative w-full", className)}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-lg border bg-input px-3 py-2 text-sm transition-all duration-200",
                    "hover:border-border-hover",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
                    error 
                        ? "border-error focus:ring-error/20 focus:border-error" 
                        : "border-input-border",
                    isOpen && "ring-2 ring-primary/20 border-primary"
                )}
            >
                <span className={cn(!selectedOption && "text-foreground-muted")}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={cn(
                    "h-4 w-4 text-foreground-muted transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            {isOpen && optionList.length > 0 && (
                <div className={cn(
                    "absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg",
                    "animate-fade-down py-1 max-h-60 overflow-auto"
                )}>
                    {optionList.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            disabled={option.disabled}
                            onClick={() => {
                                onChange?.(option.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
                                "hover:bg-secondary",
                                option.disabled && "cursor-not-allowed opacity-50",
                                option.value === normalizedValue && "bg-primary/5 text-primary"
                            )}
                        >
                            {option.label}
                            {option.value === normalizedValue && (
                                <Check className="h-4 w-4" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {error && (
                <p className="mt-1.5 text-xs text-error">{error}</p>
            )}
        </div>
    );
}

export { Select };
