import { z } from "zod";

const registerSchema = z.object({
    lastname: z.string(),
    firstname: z.string(),
    email: z.string().email(),
    password: z.string(),
})


export type RegisterSchema = z.infer<typeof registerSchema>
export default registerSchema;
