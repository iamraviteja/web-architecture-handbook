import { z } from "zod";

export const UserSchema = z.object({
    name: z.string().min(4),
    designation: z.string().min(3)
});

export type User = z.infer<typeof UserSchema>;