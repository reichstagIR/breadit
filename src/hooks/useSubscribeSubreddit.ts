"use client";

// React Query
import { useMutation } from "@tanstack/react-query";
// Zod
import { subscribeToSubredditPayload } from "@/lib/validators/subreddit";
// Axios
import axios from "axios";

export default function useSubscribeSubreddit() {
    const result = useMutation({
        mutationFn: async (payload: subscribeToSubredditPayload) => {
            const { data } = await axios.post("/api/subreddit/subscribe", payload);
            return data as string;
        },
    });

    return result;
}
