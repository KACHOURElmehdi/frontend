"use client";

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import QueryProvider from '@/context/QueryProvider';
import { Toaster } from 'react-hot-toast';

interface AppProvidersProps {
    children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
    return (
        <AuthProvider>
            <QueryProvider>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: 'var(--dc-card)',
                            color: 'var(--dc-foreground)',
                            border: '1px solid var(--dc-border)',
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: 'var(--dc-shadow-lg)',
                        },
                        success: {
                            iconTheme: {
                                primary: 'var(--dc-success)',
                                secondary: 'white',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: 'var(--dc-error)',
                                secondary: 'white',
                            },
                        },
                    }}
                />
            </QueryProvider>
        </AuthProvider>
    );
}
