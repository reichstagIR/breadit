"use client";

// React Query
import { useMutation } from "@tanstack/react-query";
// Zod
import { commentRequest } from "@/lib/validators/comment";
// Axios
import axios from "axios";

export default function useCreateComment() {
    const result = useMutation({
        mutationFn: async (payload: commentRequest) => {
            const { data } = await axios.patch("/api/subreddit/post/comment" , payload);
            return data as string;
        },
    });

    return result;
}