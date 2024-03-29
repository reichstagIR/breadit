"use client";

import { AxiosError } from "axios";
// ShadCn
import { Button } from "./ui/Button";
// Hook
import useSubscribeSubreddit from "@/hooks/useSubscribeSubreddit";
import { useCustomHook } from "@/hooks/useCustomToast";
import useUnsubscribeSubreddit from "@/hooks/useUnsubscribeSubreddit";
// ShadCn
import { toast } from "@/hooks/use-toast";
// React
import { startTransition } from "react";
// Next
import { useRouter } from "next/navigation";

interface ISubscribeLeaveToggleProps {
    subredditId: string;
    isSubscribed: boolean;
    subredditName: string;
}

export default function SubscribeLeaveToggle({
    subredditId,
    isSubscribed,
    subredditName,
}: ISubscribeLeaveToggleProps) {
    const { isLoading: subscribeLoading, mutateAsync: subscribe } =
        useSubscribeSubreddit();
    const { isLoading: unsubscribeLoading, mutateAsync: unsubscribe } =
        useUnsubscribeSubreddit();

    const router = useRouter();

    const { loginToast } = useCustomHook();

    const subscribeHandler = () => {
        subscribe({ subredditId })
            .then(() => {
                startTransition(() => {
                    router.refresh();
                });

                return toast({
                    title: "Subscribed",
                    description: `You are subscribed to r/${subredditName}`,
                });
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

    const unsubscribeHandler = () => {
        unsubscribe({ subredditId })
            .then(() => {
                startTransition(() => {
                    router.refresh();
                });

                return toast({
                    title: "Unsubscribed",
                    description: `You are unsubscribed to r/${subredditName}`,
                });
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

    return isSubscribed ? (
        <Button
            className="mb-4 mt-1 w-full"
            isLoading={unsubscribeLoading}
            onClick={unsubscribeHandler}
        >
            Leave community
        </Button>
    ) : (
        <Button
            className="mb-4 mt-1 w-full"
            isLoading={subscribeLoading}
            onClick={subscribeHandler}
        >
            Join to post
        </Button>
    );
}
