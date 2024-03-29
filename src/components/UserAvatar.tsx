// Next Auth
import { User } from "next-auth";
// ShadCn
import { AvatarFallback, Avatar } from "./ui/Avatar";
// Next
import Image from "next/image";
// Icons
import { Icons } from "./Icons";
// Radix
import { AvatarProps } from "@radix-ui/react-avatar";

interface IUserAvatarProps extends AvatarProps {
    user: Pick<User, "image" | "name">;
}

export default function UserAvatar({ user, ...props }: IUserAvatarProps) {
    return (
        <Avatar {...props}>
            {user.image ? (
                <div className="relative aspect-square h-full w-full">
                    <Image
                        alt="profile-picture"
                        fill
                        referrerPolicy="no-referrer"
                        src={user.image}
                    />
                </div>
            ) : (
                <AvatarFallback>
                    <span className="sr-only">{user.name}</span>
                    <Icons.user />
                </AvatarFallback>
            )}
        </Avatar>
    );
}
