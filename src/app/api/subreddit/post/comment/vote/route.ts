// Next Auth
import { getSession } from "@/lib/auth";
// Lib
import { db } from "@/lib/db";
// Zod
import { commentVoteValidator } from "@/lib/validators/vote";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();

        const { commentId, voteType } = commentVoteValidator.parse(body);

        const session = await getSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const existingVote = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId,
            },
        });

        if (existingVote) {
            if (existingVote.type === voteType) {
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id,
                        },
                    },
                });

                return new Response("OK");
            }

            await db.commentVote.update({
                where: {
                    userId_commentId: {
                        commentId,
                        userId: session.user.id,
                    },
                },
                data: {
                    type: voteType,
                },
            });

            return new Response("OK", { status: 200 });
        }

        await db.commentVote.create({
            data: {
                commentId,
                userId: session.user.id,
                type: voteType,
            },
        });

        return new Response("OK");
    } catch (error) {
        error;
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 });
        }

        return new Response(
            "Could not vote the comment at this time. Please try later",
            { status: 500 }
        );
    }
}
