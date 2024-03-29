// Prisma
import { EVoteType } from "@prisma/client";

export type CachedPost = {
    id: string
    title: string
    authorUsername: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any
    currentVote: EVoteType | null
    createdAt: Date
}