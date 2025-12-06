import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Empty State Component
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-16 px-4 text-center",
            className
        )}>
            {icon && (
                <div className="mb-4 p-4 rounded-2xl bg-secondary text-foreground-muted">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-foreground-muted max-w-sm mb-6">{description}</p>
            )}
            {action}
        </div>
    );
}

// Skeleton Components
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("skeleton rounded-lg", className)}
            {...props}
        />
    );
}

function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn("h-4", i === lines - 1 && "w-3/4")}
                />
            ))}
        </div>
    );
}

function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn("bg-card border border-border rounded-xl p-6 space-y-4", className)}>
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <SkeletonText lines={2} />
        </div>
    );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex gap-4 p-4 border-b border-border bg-muted">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border-b border-border last:border-0">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            ))}
        </div>
    );
}

// Loader Components
interface LoaderProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

function Loader({ size = "md", className }: LoaderProps) {
    return (
        <div className={cn(
            "relative",
            {
                "w-4 h-4": size === "sm",
                "w-8 h-8": size === "md",
                "w-12 h-12": size === "lg",
            },
            className
        )}>
            <div className="absolute inset-0 rounded-full border-2 border-border" />
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
    );
}

function LoaderDots({ className }: { className?: string }) {
    return (
        <div className={cn("flex gap-1", className)}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full animate-bounce-subtle"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    );
}

function LoaderPulse({ className }: { className?: string }) {
    return (
        <div className={cn("relative w-12 h-12", className)}>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-primary/40 animate-ping" style={{ animationDelay: "0.2s" }} />
            <div className="absolute inset-4 rounded-full bg-primary" />
        </div>
    );
}

// Full Page Loader
function PageLoader({ message }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
                <Loader size="lg" />
                {message && (
                    <p className="text-sm text-foreground-muted">{message}</p>
                )}
            </div>
        </div>
    );
}

// Avatar Component
interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

function Avatar({ src, alt, name, size = "md", className }: AvatarProps) {
    const initials = name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const sizeClasses = {
        "sm": "w-8 h-8 text-xs",
        "md": "w-10 h-10 text-sm",
        "lg": "w-12 h-12 text-base",
        "xl": "w-16 h-16 text-lg",
    };

    return (
        <div className={cn(
            "relative flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium overflow-hidden",
            sizeClasses[size],
            className
        )}>
            {src ? (
                <Image 
                    src={src} 
                    alt={alt || name || 'Avatar'} 
                    fill
                    className="object-cover" 
                />
            ) : (
                initials || "?"
            )}
        </div>
    );
}

// Progress Bar
interface ProgressProps {
    value: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "success" | "warning" | "error" | "gradient";
    showValue?: boolean;
    className?: string;
}

function Progress({ 
    value, 
    max = 100, 
    size = "md", 
    variant = "default",
    showValue = false,
    className 
}: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn("w-full", className)}>
            <div className={cn(
                "w-full rounded-full bg-secondary overflow-hidden",
                {
                    "h-1": size === "sm",
                    "h-2": size === "md",
                    "h-3": size === "lg",
                }
            )}>
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-300 ease-out",
                        {
                            "bg-primary": variant === "default",
                            "bg-success": variant === "success",
                            "bg-warning": variant === "warning",
                            "bg-error": variant === "error",
                            "bg-gradient-to-r from-primary to-accent": variant === "gradient",
                        }
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showValue && (
                <p className="text-xs text-foreground-muted mt-1">{percentage.toFixed(0)}%</p>
            )}
        </div>
    );
}

// Divider
interface DividerProps {
    orientation?: "horizontal" | "vertical";
    className?: string;
}

function Divider({ orientation = "horizontal", className }: DividerProps) {
    return (
        <div className={cn(
            "bg-border",
            orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
            className
        )} />
    );
}

// Tooltip (simple version)
interface TooltipProps {
    content: string;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
}

function Tooltip({ content, children, side = "top" }: TooltipProps) {
    return (
        <div className="relative group">
            {children}
            <div className={cn(
                "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-foreground rounded-md",
                "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap",
                {
                    "bottom-full left-1/2 -translate-x-1/2 mb-2": side === "top",
                    "top-full left-1/2 -translate-x-1/2 mt-2": side === "bottom",
                    "right-full top-1/2 -translate-y-1/2 mr-2": side === "left",
                    "left-full top-1/2 -translate-y-1/2 ml-2": side === "right",
                }
            )}>
                {content}
            </div>
        </div>
    );
}

// Spinner (alias for Loader with optional label)
interface SpinnerProps extends LoaderProps {
    label?: string;
}

function Spinner({ size = "md", className, label }: SpinnerProps) {
    return (
        <div className={cn("flex flex-col items-center gap-2", className)}>
            <Loader size={size} />
            {label && <p className="text-sm text-foreground-muted">{label}</p>}
        </div>
    );
}

export { 
    EmptyState, 
    Skeleton, 
    SkeletonText, 
    SkeletonCard, 
    SkeletonTable,
    Loader, 
    LoaderDots, 
    LoaderPulse,
    PageLoader,
    Avatar,
    Progress,
    Divider,
    Tooltip,
    Spinner,
};
