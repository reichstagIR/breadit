"use client";

// React Query
import { useMutation } from "@tanstack/react-query";
// Zod
import { subscribeToSubredditPayload } from "@/lib/validators/subreddit";
// API
import API from "@/lib/API";

export default function useUnsubscribeSubreddit() {
    const result = useMutation({
        mutationFn: async (payload: subscribeToSubredditPayload) => {
            const { data } = await API.post("/api/subreddit/unsubscribe", payload);
            return data as string;
        },
    });

    return result;
}
