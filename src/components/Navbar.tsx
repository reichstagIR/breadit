// Next
import Link from "next/link";
// Icons
import { Icons } from "./Icons";
// Styles
import { buttonVariants } from "./ui/Button";
// Next Auth
import { getSession } from "@/lib/auth";
// Component
import UserAccountNav from "./UserAccountNav";
import SearchBar from "./SearchBar";

export default async function Navbar() {
    const session = await getSession();

    return (
        <header className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-zinc-300 bg-zinc-100 py-2">
            <div className="max-w7xl container mx-auto flex h-full items-center justify-between gap-2">
                <Link className="flex items-center gap-2" href="/">
                    <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
                    <p className="hidden text-sm font-medium text-zinc-700 md:block">
                        Breadit
                    </p>
                </Link>
                <SearchBar />
                {session ? (
                    <UserAccountNav user={session.user} />
                ) : (
                    <Link className={buttonVariants()} href="/sign-in">
                        Signin
                    </Link>
                )}
            </div>
        </header>
    );
}
