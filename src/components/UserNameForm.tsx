"use client";

// React hook form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Zod
import { userNameRequest, usernameValidator } from "@/lib/validators/username";
// Prisma
import { User } from "@prisma/client";
// ShadCn
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/Card";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
// Hook
import useChangeName from "@/hooks/useChangeName";
import { useCustomHook } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/use-toast";
// Next
import { useRouter } from "next/navigation";
// Axios
import { AxiosError } from "axios";

interface IUserNameFormProps {
    user: Pick<User, "id" | "username">;
}

export default function UserNameForm({ user }: IUserNameFormProps) {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<userNameRequest>({
        resolver: zodResolver(usernameValidator),
        defaultValues: {
            name: user?.username ?? "",
        },
    });

    const router = useRouter();

    const { loginToast } = useCustomHook();

    const { mutateAsync, isLoading } = useChangeName();

    const submitHandler = ({ name }: userNameRequest) => {
        mutateAsync({ name })
            .then(() => {
                toast({
                    description: "Username changed successfully.",
                });
                router.refresh();
            })
            .catch((error) => {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {
                        return loginToast();
                    }
                } else {
                    return toast({
                        title: "There was a problem",
                        description: "Something went wrong, please try again.",
                        variant: "destructive",
                    });
                }
            });
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)}>
            <Card>
                <CardHeader>
                    <CardTitle>Your username</CardTitle>
                    <CardDescription>
                        Please enter a display name you are comfortable with.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative grid gap-1">
                        <div className="absolute left-0 top-0 grid h-10 w-8 place-items-center">
                            <span className="text-sm text-zinc-400">u/</span>
                        </div>
                        <Label className="sr-only" htmlFor="name">
                            Name
                        </Label>
                        <Input
                            className="w-[400px] pl-6"
                            id="name"
                            size={32}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button isLoading={isLoading}>Change name</Button>
                </CardFooter>
            </Card>
        </form>
    );
}
