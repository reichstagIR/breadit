"use client";

// React Query
import { useMutation } from "@tanstack/react-query";
// Zod
import { userNameRequest } from "@/lib/validators/username";
// API
import API from "@/lib/API";

export default function useChangeName() {
    const result = useMutation({
        mutationFn: async (payload: userNameRequest) => {
            const { data } = await API.patch("/api/username" , payload);
            return data as string;
        },
    });

    return result;
}