'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ArrowUpDown, MoreHorizontal } from "lucide-react";

// Table Components
type TableProps = React.HTMLAttributes<HTMLTableElement>;

const Table = React.forwardRef<HTMLTableElement, TableProps>(
    ({ className, ...props }, ref) => (
        <div className="relative w-full overflow-auto rounded-xl border border-border">
            <table
                ref={ref}
                className={cn("w-full caption-bottom text-sm", className)}
                {...props}
            />
        </div>
    )
);
Table.displayName = "Table";

type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
    ({ className, ...props }, ref) => (
        <thead ref={ref} className={cn("bg-muted/50", className)} {...props} />
    )
);
TableHeader.displayName = "TableHeader";

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
    ({ className, ...props }, ref) => (
        <tbody
            ref={ref}
            className={cn("[&_tr:last-child]:border-0", className)}
            {...props}
        />
    )
);
TableBody.displayName = "TableBody";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    isSelected?: boolean;
    isClickable?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
    ({ className, isSelected, isClickable, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn(
                "border-b border-border transition-colors",
                "hover:bg-muted/50",
                isSelected && "bg-primary/5",
                isClickable && "cursor-pointer",
                className
            )}
            {...props}
        />
    )
);
TableRow.displayName = "TableRow";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    sortable?: boolean;
    sortDirection?: "asc" | "desc" | null;
    onSort?: () => void;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
    ({ className, sortable, sortDirection, onSort, children, ...props }, ref) => (
        <th
            ref={ref}
            className={cn(
                "h-12 px-4 text-left align-middle font-medium text-foreground-muted",
                sortable && "cursor-pointer select-none hover:text-foreground",
                className
            )}
            onClick={sortable ? onSort : undefined}
            {...props}
        >
            <div className="flex items-center gap-2">
                {children}
                {sortable && (
                    <span className="flex flex-col">
                        {sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : sortDirection === "desc" ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                    </span>
                )}
            </div>
        </th>
    )
);
TableHead.displayName = "TableHead";

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
    ({ className, ...props }, ref) => (
        <td
            ref={ref}
            className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
            {...props}
        />
    )
);
TableCell.displayName = "TableCell";

// Table Action Menu
interface TableActionMenuProps {
    children: React.ReactNode;
}

function TableActionMenu({ children }: TableActionMenuProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
                <MoreHorizontal className="h-4 w-4 text-foreground-muted" />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 min-w-[160px] rounded-lg border border-border bg-popover shadow-lg py-1 animate-scale-in">
                    {children}
                </div>
            )}
        </div>
    );
}

interface TableActionItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "danger";
    icon?: React.ReactNode;
}

function TableActionItem({ 
    children, 
    variant = "default", 
    icon,
    className,
    ...props 
}: TableActionItemProps) {
    return (
        <button
            className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                variant === "default" 
                    ? "text-foreground hover:bg-secondary" 
                    : "text-error hover:bg-error-light",
                className
            )}
            {...props}
        >
            {icon}
            {children}
        </button>
    );
}

// Empty Table State
interface TableEmptyProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    colSpan: number;
}

function TableEmpty({ icon, title, description, action, colSpan }: TableEmptyProps) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan}>
                <div className="flex flex-col items-center justify-center py-12 text-center">
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
            </TableCell>
        </TableRow>
    );
}

export { 
    Table, 
    TableHeader, 
    TableBody, 
    TableRow, 
    TableHead, 
    TableCell,
    TableActionMenu,
    TableActionItem,
    TableEmpty,
};
