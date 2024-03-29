"use client";

// Prisma
import { EVoteType } from "@prisma/client";
// React
import { useEffect, useState } from "react";
// Hook
import { usePrevious } from "@mantine/hooks";
import useVotePost from "@/hooks/useVotePost";
// ShadCn
import { Button } from "../ui/Button";
// Icons
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
// lib
import { cn } from "@/lib/utils";

interface IPostVoteClientProps {
    postId: string;
    initialVotesAmt: number;
    initialVote?: EVoteType | null;
}

export function PostVoteClient({
    postId,
    initialVotesAmt,
    initialVote,
}: IPostVoteClientProps) {

    const [voteAmt, setVoteAmt] = useState<number>(initialVotesAmt);
    const [currentVote, setCurrentVote] = useState<
        EVoteType | null | undefined
    >(initialVote);
    const prevVote = usePrevious(currentVote);

    useEffect(() => {
        setCurrentVote(initialVote);
    }, [initialVote]);

    const { mutate } = useVotePost({ prevVote, setCurrentVote, setVoteAmt, currentVote });

    const voteUpHandler = () => {
        mutate({
            postId,
            voteType: "UP",
        });
    };

    const voteDownHandler = () => {
        mutate({
            postId,
            voteType: "DOWN",
        });
    };

    return (
        <div className="flex gap-4 pb-4 pr-6 sm:w-20 sm:flex-col sm:gap-0 sm:pb-0">
            <Button
                aria-label="upvote"
                onClick={voteUpHandler}
                size="sm"
                variant="ghost"
            >
                <ArrowBigUp
                    className={cn("h-5 w-5 text-zinc-700", {
                        "fill-emerald-50 text-emerald-500":
                            currentVote === "UP",
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
                        "fill-red-50 text-red-500": currentVote === "DOWN",
                    })}
                />
            </Button>
        </div>
    );
}
