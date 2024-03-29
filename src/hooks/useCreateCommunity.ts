"use client";

// React Query
import { useMutation } from "@tanstack/react-query";
// Zod
import { createSubredditPayload } from "@/lib/validators/subreddit";
// API
import API from "@/lib/API";

export default function useCreateCommunity() {
    const result = useMutation({
        mutationFn: async (payload: createSubredditPayload) => {
            const { data } = await API.post("/api/subreddit" , payload);
            return data as string;
        },
    });

    return result;
}