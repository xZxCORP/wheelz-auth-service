import { z } from "zod";

const authentificationSchema = z.object({
    id: z.number(),
    userId: z.number(),
    password: z.string(),
    salt: z.string(),
    createdAt: z.date()
})

export type AuthentificationSchema = z.infer<typeof authentificationSchema>
export default authentificationSchema;
