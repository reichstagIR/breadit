import { z } from "zod";

const subredditValidator = z.object({
    name: z.string().min(3).max(21),
});

const subredditSubscriptionValidator = z.object({
    subredditId: z.string(),
});

export { subredditValidator, subredditSubscriptionValidator };
export type createSubredditPayload = z.infer<typeof subredditValidator>
export type subscribeToSubredditPayload = z.infer<typeof subredditSubscriptionValidator>
