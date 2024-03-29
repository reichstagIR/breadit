"use client";

// ShadCn
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
// Next
import { useRouter } from "next/navigation";
// React
import { useState } from "react";
// Hook
import useCreateCommunity from "@/hooks/useCreateCommunity";
// Axios
import { AxiosError } from "axios";
// ShadCn
import { toast } from "@/hooks/use-toast";
// Hook
import { useCustomHook } from "@/hooks/useCustomToast";

export default function Page() {
    const [input, setInput] = useState<string>("");

    const router = useRouter();

    const cancelHandler = () => {
        router.back();
    };

    const { loginToast } = useCustomHook();

    const createCommunityHandler = async () => {
        await mutateAsync({ name: input })
            .then((res) => {
                router.push(`/r/${res}`);
            })
            .catch((error) => {
                if (error instanceof AxiosError) {
                    switch (error.response?.status) {
                        case 409: {
                            toast({
                                title: "Subreddit already exist.",
                                description:
                                    "Please choose a different subreddit name.",
                                variant: "destructive",
                            });
                            break;
                        }
                        case 422: {
                            toast({
                                title: "Invalid subreddit name.",
                                description:
                                    "Please choose a name between 3 and 21 character.",
                                variant: "destructive",
                            });
                            break;
                        }
                        case 401: {
                            loginToast();
                            break;
                        }
                    }
                } else {
                    toast({
                        title: "there was an  error.",
                        description: "Could not create subreddit.",
                        variant: "destructive",
                    });
                }
            });
    };

    const { mutateAsync, isLoading } = useCreateCommunity();

    return (
        <div className="container mx-auto flex h-full max-w-3xl items-center">
            <div className="relative h-fit w-full space-y-6 rounded-lg bg-white p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Create a community
                    </h1>
                </div>
                <hr className="h-px bg-zinc-500" />
                <div>
                    <p className="text-lg font-medium">Name</p>
                    <p className="pb-2 text-xs">
                        Community names includes capitalization cannot be
                        changed
                    </p>
                    <div className="relative">
                        <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400">
                            r/
                        </p>
                        <Input
                            className="pl-6"
                            onChange={(event) => setInput(event.target.value)}
                            value={input}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button onClick={cancelHandler} variant="subtle">
                        Cancel
                    </Button>
                    <Button
                        disabled={input.length === 0}
                        isLoading={isLoading}
                        onClick={createCommunityHandler}
                    >
                        Create Community
                    </Button>
                </div>
            </div>
        </div>
    );
}
