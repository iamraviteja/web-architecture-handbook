import { z } from "zod";

export const ReviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(4)
});

export type Review = z.infer<typeof ReviewSchema>;