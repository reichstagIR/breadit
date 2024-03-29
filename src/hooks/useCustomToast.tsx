// Next
import Link from "next/link";
// ShadCn
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/Button";

export function useCustomHook() {
    const loginToast = () => {

        
        function dismissHandler() {
            dismiss();
        }

        const { dismiss } = toast({
            title: "Login required!",
            description: "You need to be logged in to do that.",
            variant: "destructive",
            action: (
                <Link
                    className={buttonVariants({ variant: "outline" })}
                    href="/sign-in"
                    onClick={dismissHandler}
                >
                    Login
                </Link>
            ),
        });
    };

    return { loginToast };
}
