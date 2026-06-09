import z from "zod"

export const signUpSchema = z.object({
    name: z.string(),
    email: z.email({ message: "Invalid email address" }),
    password: z.string()
        .trim()
        .min(6, { message: "Password must contain at least 6 characters" })
        .max(12, { message: "Password cannot contain more than 12 characters" })
})

export const signInSchema =z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string()
        .trim()
        .min(6, { message: "Password must contain at least 6 characters" })
        .max(12, { message: "Password cannot contain more than 12 characters" })
})

