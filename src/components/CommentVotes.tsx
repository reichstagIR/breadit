"use client";

// Prisma
import { CommentVote } from "@prisma/client";
// React
import { useState } from "react";
// Hook
import { usePrevious } from "@mantine/hooks";
import useVoteComment from "@/hooks/useVoteComment";
// ShadCn
import { Button } from "./ui/Button";
// Icons
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
// lib
import { cn } from "@/lib/utils";

interface ICommentVotesClientProps {
    commentId: string;
    initialVotesAmt: number;
    initialVote?: Pick<CommentVote, "type">;
}

export function CommentVotes({
    commentId,
    initialVotesAmt,
    initialVote,
}: ICommentVotesClientProps) {
    const [voteAmt, setVoteAmt] = useState<number>(initialVotesAmt);
    const [currentVote, setCurrentVote] =
        useState<Pick<CommentVote, "type"> | undefined>(initialVote);
    const prevVote = usePrevious(currentVote);

    const { mutate } = useVoteComment({
        prevVote,
        setCurrentVote,
        setVoteAmt,
        currentVote,
    });

    const voteUpHandler = () => {
        mutate({ 
            commentId,
            voteType: "UP",
        });
    };

    const voteDownHandler = () => {
        mutate({
            commentId,
            voteType: "DOWN",
        });
    };

    return (
        <div className="flex gap-1">
            <Button
                aria-label="upvote"
                onClick={voteUpHandler}
                size="sm"
                variant="ghost"
            >
                <ArrowBigUp
                    className={cn("h-5 w-5 text-zinc-700", {
                        "fill-emerald-50 text-emerald-500":
                            currentVote?.type === "UP",
                    })}
                />
            </Button>
            <p className="py-2 text-center text-sm font-medium text-zinc-900">
                {voteAmt}
            </p>
            <Button
                aria-label="downvote"
                onClick={voteDownHandler}
                size="sm"
                variant="ghost"
            >
                <ArrowBigDown
                    className={cn("h-5 w-5 text-zinc-700", {
                        "fill-red-50 text-red-500": currentVote?.type === "DOWN",
                    })}
                />
            </Button>
        </div>
    );
}
