import { Comment, Subreddits, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
    subreddit: Subreddits;
    vote: Vote;
    author: User;
    comments: Comment;
};
