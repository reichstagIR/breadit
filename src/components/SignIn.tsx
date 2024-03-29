// Logo
import Link from "next/link";
// Icons
import { Icons } from "./Icons";
// Component
import UserAuthForm from "./UserAuthForm";

export default function SignIn() {
    return (
        <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
                <Icons.logo className="mx-auto h-6 w-6" />
                <h1 className="text-2xl font-semibold tracking-tighter">
                    Welcome back
                </h1>
                <p className="mx-auto max-w-xs text-sm">
                    By continuing, you are setting up a Breadit account and
                    agree to out User Agreement and Private Policy
                </p>
                <UserAuthForm />
                <p className="px-8 text-center text-sm text-zinc-700">
                    New to Breadit?{" "}
                    <Link
                        className="text-sm underline underline-offset-4 hover:text-zinc-800"
                        href="/sign-up"
                    >
                        Sing Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
