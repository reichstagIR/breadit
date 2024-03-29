"use client";

// React Query
import { useMutation } from "@tanstack/react-query";
// Axios
import axios from "axios";
// Zod
import { commentVoteRequest } from "@/lib/validators/vote";
// Prisma
import { CommentVote } from "@prisma/client";
// Axios
import { AxiosError } from "axios";
// Hook
import { useCustomHook } from "./useCustomToast";
// ShadCn
import { toast } from "@/hooks/use-toast";

interface IUseCommentPostProps {
    setVoteAmt: React.Dispatch<React.SetStateAction<number>>;
    setCurrentVote: React.Dispatch<
        React.SetStateAction<Pick<CommentVote, "type"> | undefined>
    >;
    currentVote: Pick<CommentVote, "type"> | undefined;
    prevVote: Pick<CommentVote, "type"> | undefined;
}

export default function useVoteComment(props: IUseCommentPostProps) {
    const { loginToast } = useCustomHook();

    const { setCurrentVote, setVoteAmt, prevVote, currentVote } = props;
    const result = useMutation({
        mutationFn: async (payload: commentVoteRequest) => {
            const { data } = await axios.patch(
                "/api/subreddit/post/comment/vote",
                payload
            );
            return data as string;
        },

        onMutate: (variables) => {
            if (variables.voteType === currentVote?.type) {
                setCurrentVote(undefined);
                if (variables.voteType === "UP") setVoteAmt((prev) => prev - 1);
                else if (variables.voteType === "DOWN")
                    setVoteAmt((prev) => prev + 1);
            } else {
                setCurrentVote({
                    type: variables.voteType,
                });
                if (variables.voteType === "UP")
                    setVoteAmt((prev) => prev + (currentVote ? 2 : 1));
                else if (variables.voteType === "DOWN")
                    setVoteAmt((prev) => prev - (currentVote ? 2 : 1));
            }
        },

        onError: (error, variables) => {
            if (variables.voteType === "UP") {
                setVoteAmt((prev) => prev + 1);
            } else {
                setVoteAmt((prev) => prev - 1);
            }
            setCurrentVote(prevVote);
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return loginToast();
                }
            }

            return toast({
                title: "Something went wrong.",
                description: "Your vote was not registered, please try again.",
                variant: "destructive",
            });
        },
    });

    return result;
}
