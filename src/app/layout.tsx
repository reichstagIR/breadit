// Style
import "@/styles/globals.css";
// Utils
import { cn } from "@/lib/utils";
// Font
import { Inter } from "next/font/google";
// Component
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
// Providers
import Providers from "@/components/Providers";

export const metadata = {
    title: "Breadit",
    description: "A Reddit clone built with Next.js and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
    authModal,
}: {
    children: React.ReactNode;
    authModal: React.ReactNode;
}) {
    return (
        <Providers>
            <html
                className={cn(
                    "light bg-white text-slate-900 antialiased",
                    inter.className
                )}
                lang="en"
            >
                <body className="min-h-dvh bg-slate-50 pt-12 antialiased">
                    <Toaster />
                    {/* @ts-expect-error server component */}
                    <Navbar />
                    {authModal}
                    <div className="container mx-auto h-full max-w-7xl pt-12">
                        {children}
                    </div>
                </body>
            </html>
        </Providers>
    );
}
