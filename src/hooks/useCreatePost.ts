"use client";

// React Query
import { useMutation } from "@tanstack/react-query";
// Zod
import { postCreationRequest } from "@/lib/validators/post";
// API
import API from "@/lib/API";

export default function useCreatePost() {
    const result = useMutation({
        mutationFn: async (payload: postCreationRequest) => {
            const { data } = await API.post("api/subreddit/post/create" , payload);
            return data as string;
        },
    });

    return result;
}