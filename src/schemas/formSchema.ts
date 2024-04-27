import { z } from "zod";

const postFormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters long.",
    }),
    content: z.string(),
    url: z.string(),
    comments: z.array(z.string()),
});

export type PostFormType = z.infer<typeof postFormSchema>;
export default postFormSchema;
