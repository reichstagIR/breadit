// Next
import { NextResponse, NextRequest } from "next/server";
// Next Auth
import { getSession } from "@/lib/auth";
// Zod
import { usernameValidator } from "@/lib/validators/username";
import { z } from "zod";
// lib
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.user) {
            return new NextResponse("Unauthorized!", { status: 401 });
        }

        const body = await req.json();

        const { name } = usernameValidator.parse(body);

        const username = await db.user.findFirst({
            where: {
                username: name,
            },
        });

        if (username) {
            return new NextResponse("Username is taken", { status: 409 });
        }

        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                username: name,
            },
        });

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 });
        }

        return new NextResponse("Could not change username, please try again", {
            status: 500,
        });
    }
}
