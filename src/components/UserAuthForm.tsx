"use client";
// Utils
import { cn } from "@/lib/utils";
// ShadCn
import { Button } from "./ui/Button";
// React
import { useState } from "react";
// Next Auth
import { signIn } from "next-auth/react";
// Icons
import { Icons } from "./Icons";
// Hook
import { useToast } from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function UserAuthForm({
    className,
    ...props
}: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {toast} = useToast();

    const loginWithGoogle = async () => {
        setIsLoading(true);

        try {
            await signIn("github");
        } catch (error) {
            toast({
                title: "There is a problem!",
                description: "There was an error while logging in with google!",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className={cn("flex justify-center", className)} {...props}>
            <Button
                className="w-full"
                isLoading={isLoading}
                onClick={loginWithGoogle}
                size="sm"
            >
                {isLoading ? null : <Icons.google className="mr-2 h-4 w-4" />}
                Google
            </Button>
        </div>
    );
}
