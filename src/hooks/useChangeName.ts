"use client";

// React Query
import { useMutation } from "@tanstack/react-query";
// Zod
import { userNameRequest } from "@/lib/validators/username";
// axios
import axios from "axios";

export default function useChangeName() {
    const result = useMutation({
        mutationFn: async (payload: userNameRequest) => {
            const { data } = await axios.patch("/api/username" , payload);
            return data as string;
        },
    });

    return result;
}