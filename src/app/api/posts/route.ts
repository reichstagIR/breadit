// Next Auth
import { getSession } from "@/lib/auth";
// lib
import { db } from "@/lib/db";
// Zod
import { z } from "zod";

export async function GET(req: Request) {
    const url = new URL(req.url);

    const session = await getSession();

    let followedCommunitiesIds: string[] = [];

    

    if (session) {
        const followedCommunities = await db.subscription.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                subreddit: true,
            },
        });

        followedCommunitiesIds = followedCommunities.map(
            (sub) => sub.subreddit.id
        );
    }

    try {
        const { limit, page, subredditName } = z
            .object({
                limit: z.string(),
                page: z.string(),
                subredditName: z.string().nullish().optional(),
            })
            .parse({
                subredditName: url.searchParams.get("subredditName"),
                limit: url.searchParams.get("limit"),
                page: url.searchParams.get("page"),
            });

        let whereClause = {};

        if (subredditName) {
            whereClause = {
                subreddits: {
                    name: subredditName,
                },
            };
        } else if (session) {
            whereClause = {
                subreddits: {
                    id: {
                        in: followedCommunitiesIds,
                    },
                },
            };
        }

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: "desc",
            },
            include: {
                subreddits: true,
                votes: true,
                author: true,
                comment: true,
            },
            where: whereClause,
        });

        return new Response(JSON.stringify(posts));
    } catch (error) {
        return new Response("Could not fetch posts", { status: 500 });
    }
}
