import { z } from "zod";

const postValidator = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be longer than 3 character" })
        .max(128, { message: "Title must be at least 128 character" }),
    subredditId: z.string(),
    content: z.any(),
});

export type postCreationRequest = z.infer<typeof postValidator>;

export { postValidator };
