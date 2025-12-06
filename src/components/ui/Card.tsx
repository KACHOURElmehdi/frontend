import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "gradient" | "hover" | "interactive" | "outline";
    padding?: "none" | "sm" | "md" | "lg";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", padding = "md", ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-xl border transition-all duration-200",
                {
                    // Variants
                    "bg-card border-border shadow-sm": variant === "default",
                    "glass border-white/10": variant === "glass",
                    "bg-gradient-to-br from-card to-card-hover border-border shadow-sm": variant === "gradient",
                    "bg-card border-border shadow-sm hover:shadow-md hover:border-border-hover": variant === "hover",
                    "bg-card border-border shadow-sm hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 cursor-pointer": variant === "interactive",
                    "bg-transparent border-border": variant === "outline",
                    // Padding
                    "p-0": padding === "none",
                    "p-4": padding === "sm",
                    "p-6": padding === "md",
                    "p-8": padding === "lg",
                },
                className
            )}
            {...props}
        />
    )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight text-foreground",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-foreground-muted", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center pt-4", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

// Stats Card Component
interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon?: React.ReactNode;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
    ({ className, title, value, change, changeType = "neutral", icon, ...props }, ref) => (
        <Card ref={ref} variant="hover" className={cn("", className)} {...props}>
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground-muted">{title}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    {change && (
                        <p className={cn(
                            "text-xs font-medium",
                            {
                                "text-success": changeType === "positive",
                                "text-error": changeType === "negative",
                                "text-foreground-muted": changeType === "neutral",
                            }
                        )}>
                            {change}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    )
);
StatsCard.displayName = "StatsCard";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, StatsCard };
