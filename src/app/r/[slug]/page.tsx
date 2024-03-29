// Next Auth
import { getSession } from "@/lib/auth";
// Lib
import { db } from "@/lib/db";
// Config
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
// Next
import { notFound } from "next/navigation";
// Component
import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";

interface IPageProps {
    params: {
        slug: string;
    };
}

export default async function Page({ params }: IPageProps) {
    const { slug } = params;

    const session = await getSession();

    const subreddit = await db.subreddits.findFirst({
        where: {
            name: slug,
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comment: true,
                    subreddits: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    });

    if (!subreddit) {
        return notFound();
    }

    return (
        <>
            <h1 className="h-14 text-3xl font-bold md:text-4xl">
                r/{subreddit.name}
            </h1>
            <MiniCreatePost session={session} />
            <PostFeed
                initialPosts={subreddit.posts}
                subredditName={subreddit.name}
            />
        </>
    );
}
