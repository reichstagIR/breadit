"use client";

// React
import { useRef, useState } from "react";
// ShadCn
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { toast } from "@/hooks/use-toast";
// Prisma
import { Comment, CommentVote, User } from "@prisma/client";
// lib
import { formatTimeToNow } from "@/lib/utils";
// Component
import { CommentVotes } from "./CommentVotes";
// Icon
import { MessageSquare } from "lucide-react";
// Next
import { useRouter } from "next/navigation";
// Next Auth
import { useSession } from "next-auth/react";
// Hook
import { useCustomHook } from "@/hooks/useCustomToast";
import useCreateComment from "@/hooks/useCreateComment";
// Axios
import { AxiosError } from "axios";

interface IPostCommentProps {
    comment: Comment & {
        votes: CommentVote[];
        author: User;
    };
    initialVotesAmt: number;
    initialVote: CommentVote | undefined;
    postId: string;
}

export default function PostComment({
    comment,
    initialVote,
    initialVotesAmt,
    postId,
}: IPostCommentProps) {
    const commentRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const [input, setInput] = useState<string>("");

    const { data: session } = useSession();

    const [isReplaying, setIsReplying] = useState<boolean>(false);

    const { mutateAsync, isLoading } = useCreateComment();

    const { loginToast } = useCustomHook();

    const createReplayHandler = () => {
        if (!input) return;
        mutateAsync({
            postId,
            text: input,
            replayToId: comment.replayToId ?? comment.id,
        })
            .then(() => {
                router.refresh();
                setIsReplying(false);
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

    const replayHandler = () => {
        if (!session) {
            return router.push("/sing-in");
        }
        setIsReplying(true);
    };

    return (
        <div className="flex flex-col" ref={commentRef}>
            <div className="flex items-center">
                <UserAvatar
                    className="h-6 w-6"
                    user={{
                        name: comment.author.name || null,
                        image: comment.author.image || null,
                    }}
                />

                <div className="ml-2 flex items-center gap-x-2 ">
                    <p className="text-sm font-medium text-gray-900">
                        u/{comment.author.username}
                    </p>
                    <p className="max-h-40 truncate text-xs text-zinc-500">
                        {formatTimeToNow(new Date(comment.createdAt))}
                    </p>
                </div>
            </div>
            <p className="mt-2 text-sm text-zinc-900">{comment.text}</p>

            <div className="flex flex-wrap items-center gap-2">
                <CommentVotes
                    commentId={comment.id}
                    initialVote={initialVote}
                    initialVotesAmt={initialVotesAmt}
                />
                <Button
                    aria-label="replay"
                    onClick={replayHandler}
                    size="xs"
                    variant="ghost"
                >
                    <MessageSquare className="mr-1.5 h-4 w-4" />
                    Replay
                </Button>
                {isReplaying ? (
                    <div className="grid w-full gap-1.5">
                        <Label>Your comment</Label>
                        <div className="grid w-full gap-x-1.5">
                            <div className="mt-2">
                                <Textarea
                                    id="comment"
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="What are your thoughts?"
                                    value={input}
                                />

                                <div className="mt-2 flex justify-end gap-2">
                                    <Button
                                        disabled={input?.length === 0}
                                        isLoading={isLoading}
                                        onClick={createReplayHandler}
                                    >
                                        Post
                                    </Button>
                                    <Button
                                        onClick={() => setIsReplying(false)}
                                        tabIndex={-1}
                                        variant="subtle"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
