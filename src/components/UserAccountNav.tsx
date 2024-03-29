"use client";

// Next Auth
import { User } from "next-auth";
// ShadCn
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/Dropdown";
// Component
import UserAvatar from "./UserAvatar";
// Next
import Link from "next/link";
// Next Auth
import { signOut } from "next-auth/react";

interface IUserAccountNavProps {
    user: Pick<User, "email" | "image" | "name">;
}

export default function UserAccountNav({ user }: IUserAccountNavProps) {
    const singOutHandler = (event: Event) => {
        event.preventDefault();
        const origin = window.location.origin;


        signOut({
            callbackUrl: `${origin}/sign-in`,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar className="h-8 w-8" user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
                <div className="flex items-center justify-center gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && (
                            <p className="font-medium">{user.name}</p>
                        )}
                        {user.email && (
                            <p className="w-[200px] truncate text-sm font-medium text-zinc-700">
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/">Feed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/r/create">Create community</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={singOutHandler}
                >
                    Sing out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
