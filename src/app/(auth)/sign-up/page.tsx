// Styles
import { buttonVariants } from "@/components/ui/Button";
// Utils
import { cn } from "@/lib/utils";
// Next
import Link from "next/link";
// Component
import SignUp from "@/components/SignUp";
// Icons
import { ChevronLeft } from "lucide-react";

export default function Page() {
    return (
        <div className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20">
                <Link
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "-mt-20 self-start"
                    )}
                    href="/"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Home
                </Link>
                <SignUp />
            </div>
        </div>
    );
}
