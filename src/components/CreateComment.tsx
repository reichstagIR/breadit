"use client";

// ShadCn
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
// React
import { useState } from "react";
// Hook
import useCreateComment from "@/hooks/useCreateComment";
// ShadCn
import { Button } from "./ui/Button";
import { toast } from "@/hooks/use-toast";
// Hook
import { useCustomHook } from "@/hooks/useCustomToast";
// Axios
import { AxiosError } from "axios";
// Next
import { useRouter } from "next/navigation";

interface ICreatePostProps {
    postId: string;
    replayToId?: string;
}

export default function CreateComment({
    postId,
    replayToId,
}: ICreatePostProps) {
    const [input, setInput] = useState<string>("");

    const { mutateAsync, isLoading } = useCreateComment();

    const { loginToast } = useCustomHook();

    const router = useRouter();

    const createCommentHandler = () => {
        mutateAsync({ postId, text: input, replayToId })
            .then(() => {
                router.refresh();
                setInput("");
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
        <div className="grid w-full gap-x-1.5">
            <Label htmlFor="comment">Your Comment</Label>
            <div className="mt-2">
                <Textarea
                    id="comment"
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What are your thoughts?"
                    value={input}
                />

                <div className="mt-2 flex justify-end">
                    <Button
                        disabled={input?.length === 0}
                        isLoading={isLoading}
                        onClick={createCommentHandler}
                    >
                        Post
                    </Button>
                </div>
            </div>
        </div>
    );
}
