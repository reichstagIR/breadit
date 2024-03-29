"use client";

// Next Auth
import { Session } from "next-auth";
// Next
import { useRouter, usePathname } from "next/navigation";
// Component
import UserAvatar from "./UserAvatar";
// ShadCn
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
// Icons
import { ImageIcon, Link2 } from "lucide-react";

interface IMiniCreatePostProps {
    session: Session | null;
}

export default function MiniCreatePost({ session }: IMiniCreatePostProps) {
    const router = useRouter();

    const pathname = usePathname();

    const navigateToCreatePostHandler = () => {
        router.push(pathname + "/submit");
    };

    return (
        <li className="overflow-hidden rounded-md bg-white shadow">
            <div className="flex h-full justify-between gap-6 px-6 py-4">
                <div className="relative">
                    <UserAvatar
                        user={{
                            name: session?.user.name || null,
                            image: session?.user.image || null,
                        }}
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline-2 outline-white"></span>
                </div>
                <Input
                    onClick={navigateToCreatePostHandler}
                    placeholder="Create post"
                    readOnly
                />
                <Button onClick={navigateToCreatePostHandler} variant="ghost">
                    <ImageIcon className="text-zinc-600" />
                </Button>
                <Button onClick={navigateToCreatePostHandler} variant="ghost">
                    <Link2 className="text-zinc-600" />
                </Button>
            </div>
        </li>
    );
}
