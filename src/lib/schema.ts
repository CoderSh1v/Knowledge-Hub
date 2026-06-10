import z from "zod"

export const signUpSchema = z.object({
    name: z.string(),
    email: z.email({ message: "Invalid email address" }),
    password: z.string()
        .trim()
        .min(6, { message: "Password must contain at least 6 characters" })
        .max(12, { message: "Password cannot contain more than 12 characters" })
})

export const signInSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string()
        .trim()
        .min(6, { message: "Password must contain at least 6 characters" })
        .max(12, { message: "Password cannot contain more than 12 characters" })
})

export const newProjectSchema = z.object({
    title: z.string()
        .trim()
        .min(1, { message: "Project name cannot be empty" }),
    description: z.string()
        .max(300, { message: "Description cannot have more than 300 words" })
        .optional()

})



