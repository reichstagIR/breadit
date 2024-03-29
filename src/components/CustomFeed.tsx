// lib
import { db } from "@/lib/db";
// Config
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
// Component
import PostFeed from "./PostFeed";
// Next Auth
import { getSession } from "@/lib/auth";

export default async function CustomFeed() {
    const session = await getSession();

    const subscriptions = await db.subscription.findMany({
        where: {
            userId: session?.user.id,
        },
        include: {
            subreddit: true,
        }
    });

    const posts = await db.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        where: {
            subreddits: {
                name: {
                    in: subscriptions.map(({subreddit}) =>subreddit.name )
                }
            }
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
