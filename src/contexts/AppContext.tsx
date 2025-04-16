// components/providers/AppProviders.tsx
'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/hooks/use-theme';
import { AuthProvider } from '@/contexts/AuthContext';
import QueryClientContext from '@/contexts/QueryClientContext'; // assuming this wraps React Query
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
export default function AppContext({ children }: { children: ReactNode }) {
    return (
        <QueryClientContext>
            <ThemeProvider defaultTheme="light">
                <AuthProvider>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        {children}
                    </TooltipProvider>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientContext>
    );
}
