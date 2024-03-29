"use client";

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
// type
import { ExtendedPost } from "@/types/db";
// Hook
import { useIntersection } from "@mantine/hooks";
// React Query
import { useInfiniteQuery } from "@tanstack/react-query";
// axios
import axios from "axios";
// React
import { useRef } from "react";
// Next Auth
import { useSession } from "next-auth/react";
// Component
import Post from "./Post";

interface IPostFeedProps {
    initialPosts: ExtendedPost[];
    subredditName?: string;
}

export default function PostFeed({
    initialPosts,
    subredditName,
}: IPostFeedProps) {
    const lastPostRef = useRef<HTMLElement>(null);

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    const { data: session } = useSession();

    const { data, fetchNextPage } = useInfiniteQuery(
        ["infinite-query"],
        async ({ pageParam = 1 }) => {
            const query =
                `api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
                (subredditName ? `$subredditName=${subredditName}` : "");

            const { data } = await axios.get(query);
            return data as ExtendedPost[];
        },
        {
            getNextPageParam: (_, pages) => {
                return pages.length + 1;
            },
            initialData: { pages: [initialPosts], pageParams: [1] },
        }
    );

    if (entry?.isIntersecting) {
        fetchNextPage();
    }

    const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

    return (
        <ul className="col-span-2 flex flex-col space-y-6">
            {posts.map((post, index) => {
                const votesAmt = post.votes.reduce(
                    (acc: number, vote: { type: string }) => {
                        if (vote.type === "UP") return acc + 1;
                        if (vote.type === "DOWN") return acc - 1;
                        return acc;
                    },
                    0
                );

                const currentVote = post.votes.find(
                    (vote: { userId: string | undefined }) =>
                        vote.userId === session?.user.id
                );

                if (index === posts.length - 1) {
                    return (
                        <li key={post.id} ref={ref}>
                            <Post
                                commentAmt={post.comment.length}
                                currentVote={currentVote}
                                post={post}
                                subredditName={post.subreddits.name}
                                voteAmt={votesAmt}
                            />
                        </li>
                    );
                } else {
                    return (
                        <Post
                            commentAmt={post.comment.length}
                            currentVote={currentVote}
                            key={post.id}
                            post={post}
                            subredditName={post.subreddits.name}
                            voteAmt={votesAmt}
                        />
                    );
                }
            })}
        </ul>
    );
}
