import { z } from "zod";

const comentFormSchema = z.object({
    comment : z.string().min(2, {
        message: "Title must be at least 2 characters long.",
    }),
});

export type PostFormType = z.infer<typeof comentFormSchema>;
export default comentFormSchema;
