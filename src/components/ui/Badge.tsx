import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, CheckCircle2, Clock, AlertCircle, Upload, Loader2 } from "lucide-react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "success" | "warning" | "error" | "info" | "gradient";
    size?: "sm" | "md" | "lg";
    dot?: boolean;
    icon?: LucideIcon;
}

function Badge({ 
    className, 
    variant = "default", 
    size = "md",
    dot = false,
    icon: Icon,
    children,
    ...props 
}: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 font-medium transition-colors",
                // Size variants
                {
                    "px-2 py-0.5 text-xs rounded-md": size === "sm",
                    "px-2.5 py-1 text-xs rounded-lg": size === "md",
                    "px-3 py-1.5 text-sm rounded-lg": size === "lg",
                },
                // Color variants
                {
                    "bg-primary/10 text-primary border border-primary/20": variant === "default",
                    "bg-secondary text-secondary-foreground border border-border": variant === "secondary",
                    "bg-transparent text-foreground border border-border": variant === "outline",
                    "bg-success-light text-success-foreground border border-success/20": variant === "success",
                    "bg-warning-light text-warning-foreground border border-warning/20": variant === "warning",
                    "bg-error-light text-error-foreground border border-error/20": variant === "error",
                    "bg-info-light text-info-foreground border border-info/20": variant === "info",
                    "bg-gradient-to-r from-primary to-accent text-white border-0": variant === "gradient",
                },
                className
            )}
            {...props}
        >
            {dot && (
                <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    {
                        "bg-primary": variant === "default",
                        "bg-foreground-muted": variant === "secondary" || variant === "outline",
                        "bg-success": variant === "success",
                        "bg-warning": variant === "warning",
                        "bg-error": variant === "error",
                        "bg-info": variant === "info",
                        "bg-white": variant === "gradient",
                    }
                )} />
            )}
            {Icon && <Icon className="w-3 h-3" />}
            {children}
        </div>
    );
}

// Status Badge Component for Document Status
type DocumentStatus = 'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'ERROR';

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
    status: DocumentStatus;
    animated?: boolean;
}

function StatusBadge({ status, animated = true, className, ...props }: StatusBadgeProps) {
    const statusConfig: Record<DocumentStatus, { 
        variant: BadgeProps['variant']; 
        label: string; 
        icon: LucideIcon;
    }> = {
        UPLOADED: { variant: "info", label: "Uploaded", icon: Upload },
        PROCESSING: { variant: "warning", label: "Processing", icon: Loader2 },
        PROCESSED: { variant: "success", label: "Processed", icon: CheckCircle2 },
        ERROR: { variant: "error", label: "Error", icon: AlertCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge 
            variant={config.variant} 
            className={cn(className)}
            {...props}
        >
            <Icon className={cn(
                "w-3 h-3",
                status === 'PROCESSING' && animated && "animate-spin"
            )} />
            {config.label}
        </Badge>
    );
}

// Confidence Badge
interface ConfidenceBadgeProps extends Omit<BadgeProps, 'variant'> {
    confidence: number;
}

function ConfidenceBadge({ confidence, className, ...props }: ConfidenceBadgeProps) {
    const getVariant = (value: number): BadgeProps['variant'] => {
        if (value >= 80) return "success";
        if (value >= 50) return "warning";
        return "error";
    };

    return (
        <Badge 
            variant={getVariant(confidence)} 
            className={cn(className)}
            {...props}
        >
            {confidence.toFixed(0)}% confidence
        </Badge>
    );
}

export { Badge, StatusBadge, ConfidenceBadge };
