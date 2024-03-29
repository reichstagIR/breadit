// lib
import { db } from "@/lib/db";
// Config
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
// Component
import PostFeed from "./PostFeed";

export default async function GeneralFeed() {
    const posts = await db.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            author: true,
            comment: true,
            votes: true,
            subreddits: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    });

    return <PostFeed initialPosts={posts} />;
}
