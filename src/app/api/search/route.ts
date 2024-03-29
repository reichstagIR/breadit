// Next
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const q = url.searchParams.get("q");

    if (!q) {
        return new NextResponse("Invalid query!", { status: 400 });
    }

    const result = await db.subreddits.findMany({
        where: {
            name: {
                startsWith: q,
            },
        },
        include: {
            _count: true,
        },
        take: 5,
    });

    return new NextResponse(JSON.stringify(result), { status: 200 });
}
