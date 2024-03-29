// Next Auth
import { getSession } from "@/lib/auth";
// Lib
import { db } from "@/lib/db";
// Zod
import { postVoteValidator } from "@/lib/validators/vote";
import { z } from "zod";
// Redis
import { redis } from "@/lib/redis";
import { CachedPost } from "@/types/redis";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: Request) {
    try {
        const body = await req.json();

        const { postId, voteType } = postVoteValidator.parse(body);

        const session = await getSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const existingVote = await db.vote.findFirst({
            where: {
                userId: session.user.id,
                postId,
            },
        });

        const post = await db.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                author: true,
                votes: true,
            },
        });

        if (!post) {
            return new Response("Post not found", { status: 404 });
        }

        if (existingVote) {
            if (existingVote.type === voteType) {
                await db.vote.delete({
                    where: {
                        userId_postId: {
                            postId,
                            userId: session.user.id,
                        },
                    },
                });

                const votesAmt = post.votes.reduce((acc, vote) => {
                    if (vote.type === "UP") return acc + 1;
                    if (vote.type === "DOWN") return acc - 1;
                    return acc;
                }, 0);

                if (votesAmt >= CACHE_AFTER_UPVOTES) {
                    const cachePayload: CachedPost = {
                        authorUsername: post.author.username ?? "",
                        content: JSON.stringify(post.content),
                        id: post.id,
                        title: post.title,
                        currentVote: null,
                        createdAt: post.createdAt,
                    };

                    await redis.hset(`post:${postId}`, cachePayload); 
                }

                return new Response("OK");
            }

            await db.vote.update({
                where: {
                    userId_postId: {
                        postId,
                        userId: session.user.id,
                    },
                },
                data: {
                    type: voteType,
                },
            });

            const votesAmt = post.votes.reduce((acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc;
            }, 0);

            if (votesAmt >= CACHE_AFTER_UPVOTES) {
                const cachePayload: CachedPost = {
                    authorUsername: post.author.username ?? "",
                    content: JSON.stringify(post.content),
                    id: post.id,
                    title: post.title,
                    currentVote: voteType,
                    createdAt: post.createdAt,
                };

                await redis.hset(`post:${postId}`, cachePayload); 
            }

            return new Response("OK");
        }

        await db.vote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                postId,
            },
        });

        const votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1;
            if (vote.type === "DOWN") return acc - 1;
            return acc;
        }, 0);

        if (votesAmt >= CACHE_AFTER_UPVOTES) {
            const cachePayload: CachedPost = {
                authorUsername: post.author.username ?? "",
                content: JSON.stringify(post.content),
                id: post.id,
                title: post.title,
                currentVote: voteType,
                createdAt: post.createdAt,
            };

            await redis.hset(`post:${postId}`, cachePayload);
        }

        return new Response("OK");
    } catch (error) {
        error;
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 });
        }

        return new Response(
            "Could not vote the post at this time. Please try later",
            { status: 500 }
        );
    }
}
