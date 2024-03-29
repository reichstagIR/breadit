"use client";

// React Query
import { useMutation } from "@tanstack/react-query";
// API
import API from "@/lib/API";
// Zod
import { postVoteRequest } from "@/lib/validators/vote";
// Prisma
import { EVoteType } from "@prisma/client";
// Axios
import { AxiosError } from "axios";
// Hook
import { useCustomHook } from "./useCustomToast";
// ShadCn
import { toast } from "@/hooks/use-toast";

interface IUseVotePostProps {
    setVoteAmt: React.Dispatch<React.SetStateAction<number>>;
    setCurrentVote: React.Dispatch<
        React.SetStateAction<EVoteType | null | undefined>
    >;
    currentVote: EVoteType | null | undefined;
    prevVote: EVoteType | null | undefined;
}

export default function useVotePost(props: IUseVotePostProps) {
    const { loginToast } = useCustomHook();

    const { setCurrentVote, setVoteAmt, prevVote, currentVote } = props;
    const result = useMutation({
        mutationFn: async (payload: postVoteRequest) => {
            const { data } = await API.patch(
                "/api/subreddit/post/vote",
                payload
            );
            return data as string;
        },

        onMutate: (variables) => {
            if (variables.voteType === currentVote) {
                setCurrentVote(undefined);
                if (variables.voteType === "UP") setVoteAmt((prev) => prev - 1);
                else if (variables.voteType === "DOWN")
                    setVoteAmt((prev) => prev + 1);
            } else {
                setCurrentVote(variables.voteType);
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
