import { z } from "zod";


export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6)
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>