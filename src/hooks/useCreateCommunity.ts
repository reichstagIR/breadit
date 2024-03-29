"use client";

// React Query
import { useMutation } from "@tanstack/react-query";
// Zod
import { createSubredditPayload } from "@/lib/validators/subreddit";
// Axios
import axios from "axios";

export default function useCreateCommunity() {
    const result = useMutation({
        mutationFn: async (payload: createSubredditPayload) => {
            const { data } = await axios.post("api/subreddit" , payload);
            return data as string;
        },
    });

    return result;
}