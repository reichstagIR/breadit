// Next Auth
import { getSession } from "@/lib/auth";
// lib
import { db } from "@/lib/db";
// Component
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface ICommentSectionProps {
    postId: string;
}

export default async function CommentSection({ postId }: ICommentSectionProps) {
    const session = await getSession();

    const comments = await db.comment.findMany({
        where: {
            postId,
            replayTo: null,
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true,
                },
            },
        },
    });

    return (
        <div className="mt-4 flex flex-col gap-y-4">
            <hr className="my-6 h-px w-full" />

            <CreateComment postId={postId} />

            <div className="mt-4 flex flex-col gap-y-5">
                {comments
                    .filter((comment) => !comment.replayToId)
                    .map((topLevelComment) => {
                        const topLevelCommentVoteAmt =
                            topLevelComment.votes.reduce((acc, vote) => {
                                if (vote.type === "UP") return acc + 1;
                                if (vote.type === "DOWN") return acc - 1;
                                return acc;
                            }, 0);

                        const topLevelCommentVote = topLevelComment.votes.find(
                            (vote) => vote.userId === session?.user.id
                        );
                        return (
                            <div
                                className="flex flex-col"
                                key={topLevelComment.id}
                            >
                                <div className="mb-2">
                                    <PostComment
                                        comment={topLevelComment}
                                        initialVote={topLevelCommentVote}
                                        initialVotesAmt={topLevelCommentVoteAmt}
                                        postId={postId}
                                    />
                                    {topLevelComment.replies
                                        .sort(
                                            (a, b) =>
                                                b.votes.length - a.votes.length
                                        )
                                        .map((replay) => {
                                            const replayVoteAmt =
                                                replay.votes.reduce(
                                                    (acc, vote) => {
                                                        if (vote.type === "UP")
                                                            return acc + 1;
                                                        if (
                                                            vote.type === "DOWN"
                                                        )
                                                            return acc - 1;
                                                        return acc;
                                                    },
                                                    0
                                                );

                                            const replayVote =
                                                replay.votes.find(
                                                    (vote) =>
                                                        vote.userId ===
                                                        session?.user.id
                                                );
                                            return (
                                                <div
                                                    className="ml-2 border-l-2 border-zinc-200 py-2 pl-4"
                                                    key={replay.id}
                                                >
                                                    <PostComment
                                                        comment={replay}
                                                        initialVote={replayVote}
                                                        initialVotesAmt={
                                                            replayVoteAmt
                                                        }
                                                        postId={postId}
                                                    />
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
