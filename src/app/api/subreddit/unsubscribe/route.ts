// Next
import { NextRequest, NextResponse } from "next/server";
// Next Auth
import { getSession } from "@/lib/auth";
// Zod
import { subredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";
// lib
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        const { subredditId } = subredditSubscriptionValidator.parse(body);

        const subscriptionExist = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id,
            },
        });

        if (!subscriptionExist) {
            return new NextResponse(
                "You are already unsubscribed to this subreddit.",
                { status: 400 }
            );
        }

        const subreddit = await db.subreddits.findFirst({
            where: {
                id: subredditId,
                creatorId: session.user.id,
            },
        });

        if (subreddit) {
            return new NextResponse(
                "You can not unsubscribe your own subreddit.",
                { status: 400 }
            );
        }

        await db.subscription.delete({
            where: {
                userId_subredditId: {
                    subredditId,
                    userId: session.user.id,
                },
            },
        });

        return new NextResponse(subredditId, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 });
        }

        return new NextResponse("Could not unsubscribe subreddit", {
            status: 500,
        });
    }
}
