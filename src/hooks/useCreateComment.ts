"use client";

// React Query
import { useMutation } from "@tanstack/react-query";
// Zod
import { commentRequest } from "@/lib/validators/comment";
// API
import API from "@/lib/API";

export default function useCreateComment() {
    const result = useMutation({
        mutationFn: async (payload: commentRequest) => {
            const { data } = await API.patch("api/subreddit/post/comment" , payload);
            return data as string;
        },
    });

    return result;
}