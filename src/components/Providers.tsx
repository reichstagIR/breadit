"use client";

// React Query
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// Next Auth
import { SessionProvider } from "next-auth/react";

const client = new QueryClient();

interface IProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: IProvidersProps) {
    return (
        <QueryClientProvider client={client}>
            <SessionProvider>{children}</SessionProvider>
        </QueryClientProvider>
    );
}
