'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    showClose?: boolean;
}

function Modal({ 
    isOpen, 
    onClose, 
    title, 
    description, 
    children, 
    size = "md",
    showClose = true 
}: ModalProps) {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    React.useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div 
                    className={cn(
                        "relative bg-card border border-border rounded-2xl shadow-2xl animate-scale-in",
                        "max-h-[90vh] overflow-hidden flex flex-col",
                        {
                            "w-full max-w-sm": size === "sm",
                            "w-full max-w-md": size === "md",
                            "w-full max-w-lg": size === "lg",
                            "w-full max-w-2xl": size === "xl",
                            "w-full max-w-[90vw] h-[90vh]": size === "full",
                        }
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    {(title || showClose) && (
                        <div className="flex items-start justify-between p-6 border-b border-border">
                            <div>
                                {title && (
                                    <h2 className="text-lg font-semibold text-foreground">
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className="mt-1 text-sm text-foreground-muted">
                                        {description}
                                    </p>
                                )}
                            </div>
                            {showClose && (
                                <button
                                    onClick={onClose}
                                    className="p-2 -m-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-secondary transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 overflow-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Confirmation Dialog
interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "danger";
    isLoading?: boolean;
}

function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
            <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-foreground-muted mb-6">{description}</p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary-hover rounded-lg transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50",
                            variant === "danger" 
                                ? "bg-error text-white hover:bg-error/90" 
                                : "bg-primary text-primary-foreground hover:bg-primary-hover"
                        )}
                    >
                        {isLoading ? "Loading..." : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export { Modal, ConfirmDialog };
