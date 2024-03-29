// Next Auth
import { getSession } from "@/lib/auth";
// Next
import { NextRequest, NextResponse } from "next/server";
// Zod
import { subredditValidator } from "@/lib/validators/subreddit";
// lib
import { db } from "@/lib/db";
// Zod
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        const { name } = subredditValidator.parse(body);

        const subredditExist = await db.subreddits.findFirst({
            where: {
                name,
            },
        });

        if (subredditExist) {
            return new NextResponse("Subreddit already exist", {
                status: 409,
            });
        }

        const subreddit = await db.subreddits.create({
            data: {
                name,
                creatorId: session.user.id,
            },
        });

        await db.subscription.create({
            data: {
                subredditId: subreddit.id,
                userId: session.user.id,
            },
        });

        return new NextResponse(subreddit.name, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 });
        }

        return new NextResponse("Could not create subreddit", { status: 500 });
    }
}
