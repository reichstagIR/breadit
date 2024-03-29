// Next Auth
import { getSession } from "@/lib/auth";
// Prism
import { EVoteType, Post, Vote } from "@prisma/client";
// Next
import { notFound } from "next/navigation";
import { PostVoteClient } from "./PostVoteClient";

interface IPostVoteServerProps {
    postId: string;
    initialVoteAmt?: number;
    initialVote?: EVoteType | null | undefined;
    getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

export default async function PostVoteServer({
    postId,
    getData,
    initialVote,
    initialVoteAmt,
}: IPostVoteServerProps) {
    const session = await getSession();

    let _votesAmt = 0;
    let _currentVote: EVoteType | null | undefined = undefined;

    if (getData) {
        const post = await getData();
        if (!post) return notFound();
        _votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1;
            if (vote.type === "DOWN") return acc - 1;
            return acc;
        }, 0);
        _currentVote = post.votes.find(
            (vote) => vote.userId === session?.user.id
        )?.type;
    } else {
        _votesAmt = initialVoteAmt!;
        _currentVote = initialVote;
    }

    return (
        <PostVoteClient
            initialVote={_currentVote}
            initialVotesAmt={_votesAmt}
            postId={postId}
        />
    );
}
