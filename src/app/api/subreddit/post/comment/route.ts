// Next
import { NextResponse, NextRequest } from "next/server";
// Zod
import { commentValidator } from "@/lib/validators/comment";
import { z } from "zod";
// Session
import { getSession } from "@/lib/auth";
// lib
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();

        const { postId, text, replayToId } = commentValidator.parse(body);

        const session = await getSession();

        if (!session?.user) {
            return new NextResponse("Unauthorized.", { status: 401 });
        }

        await db.comment.create({
            data: {
                text,
                postId,
                authorId: session.user.id,
                replayToId,
            },
        });

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 });
        }

        return new NextResponse("Could not create comment, please try again", {
            status: 500,
        });
    }
}
