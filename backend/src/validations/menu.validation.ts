import { z } from "zod";

export const createPostSchema = z.object({
  author: z
    .string({ required_error: "Author is required" })
    .trim()
    .min(1, "Author cannot be empty")
    .max(50, "Author name must be 50 characters or less"),
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be 1000 characters or less"),
});

export const addCommentSchema = z.object({
  author: z
    .string({ required_error: "Author is required" })
    .trim()
    .min(1, "Author cannot be empty")
    .max(50, "Author name must be 50 characters or less"),
  text: z
    .string({ required_error: "Comment text is required" })
    .trim()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be 500 characters or less"),
});

export const postIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid post ID format"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type AddCommentInput = z.infer<typeof addCommentSchema>;
