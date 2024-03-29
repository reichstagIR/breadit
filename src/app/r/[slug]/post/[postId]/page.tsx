// Component
import CommentSection from "@/components/CommentSection";
import EditorOutput from "@/components/EditorOutput";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
// ShadCn
import { buttonVariants } from "@/components/ui/Button";
// lib
import { db } from "@/lib/db";
// Redis
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
// Type
import { CachedPost } from "@/types/redis";
// Prisma
import { Post, User, Vote } from "@prisma/client";
// Icon
import { ArrowBigDown, ArrowBigUp, Loader, Loader2 } from "lucide-react";
// Next
import { notFound } from "next/navigation";
// React
import { Suspense } from "react";

interface IPageParams {
    params: {
        postId: string;
    };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Page({ params }: IPageParams) {
    const cachedPost = (await redis.hgetall(
        `post:${params.postId}`
    )) as CachedPost;

    let post: (Post & { votes: Vote[]; author: User }) | null = null;

    if (!cachedPost) {
        post = await db.post.findFirst({
            where: {
                id: params.postId,
            },
            include: {
                votes: true,
                author: true,
            },
        });
    }

    if (!post && !cachedPost) return notFound();

    return (
        <div>
            <div className="flex w-full flex-col items-center justify-between sm:flex-row sm:items-center">
                <Suspense fallback={<PostVoteShell />}>
                    {/* eslint-disable-next-line */}
                    {/* @ts-expect-error */}
                    <PostVoteServer
                        getData={async () => {
                            return await db.post.findUnique({
                                where: {
                                    id: params.postId,
                                },
                                include: {
                                    votes: true,
                                },
                            });
                        }}
                        postId={post?.id ?? cachedPost.id}
                    />
                </Suspense>
                <div className="w-full flex-1 rounded-sm bg-white p-4 sm:w-0">
                    <p className="mt-1 max-h-40 truncate text-xs text-gray-500">
                        Posted by <u />
                        {post?.author.username ?? cachedPost.authorUsername}
                        {formatTimeToNow(
                            new Date(post?.createdAt ?? cachedPost.createdAt)
                        )}
                    </p>
                    <h1 className="py-2 text-xl font-semibold leading-6 text-gray-600">
                        {post?.title ?? cachedPost.title}
                    </h1>
                    <EditorOutput
                        content={post?.content ?? cachedPost.content}
                    />

                    <Suspense
                        fallback={
                            <Loader className="h-5 w-5 animate-spin text-zinc-500" />
                        }
                    >
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-expect-error */}
                        <CommentSection postId={post?.id ?? cachedPost.id} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

function PostVoteShell() {
    return (
        <div className="flex w-20 flex-col items-center pr-6">
            <div className={buttonVariants({ variant: "ghost" })}>
                <ArrowBigUp className="h-5 " />
            </div>
            <div className="tet-center py-2 text-sm font-medium text-zinc-900">
                <Loader2 className="h-3 w-3 animate-spin" />
            </div>
            <div className={buttonVariants({ variant: "ghost" })}>
                <ArrowBigDown className="h-5 " />
            </div>
        </div>
    );
}
