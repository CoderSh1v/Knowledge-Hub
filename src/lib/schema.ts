import z from "zod"

export const signUpSchema = z.object({
    name: z.string().trim().min(1, "Name is required "),
    email: z.email({ error: (issue) => issue.input === "" ? "Email is required" : "Invalid email address" }),
    password: z.string()
        .trim()
        .min(6, { message: "Password must contain at least 6 characters" })
        .max(12, { message: "Password cannot contain more than 12 characters" })
})

export const signInSchema = z.object({
    email: z.email({ error: (issue) => issue.input === "" ? "Email is required" : "Invalid email address" }),
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

const MAX_SIZE = 5 * 1024 * 1024
export const newResourceSchema = z.object({
    resourceType: z.enum(['note', 'pdf', 'image', 'link']),
    title: z.string().trim().min(1, { message: "Resource name is required" }),
    description: z.string().optional(),
    url: z.string().optional(),
    tags: z.array(z.string()).default([]),
    file: z
        .unknown()
        .transform((value) => {
            if (typeof FileList !== "undefined" && value instanceof FileList) return value.item(0) ?? undefined;

            if (value instanceof File) return value;

            return undefined;
        })
        .refine((file) => !file || file.size <= MAX_SIZE, { message: "File size must be less than 5MB", })
        .optional()
}).superRefine((data, ctx) => {
    if (data.resourceType === "link") {
        if (!data.url?.trim()) {
            ctx.addIssue({
                code: "custom",
                path: ["url"],
                message: "URL is required",
            });
        } else {
            const result = z.url().safeParse(data.url);

            if (!result.success) {
                ctx.addIssue({
                    code: "custom",
                    path: ["url"],
                    message: "Invalid URL",
                });
            }
        }
    }
    
    if (data.resourceType === "pdf") {
        if (!data.file) {
            ctx.addIssue({
                code: "custom",
                path: ["file"],
                message: "File is required",
            });
        } else if (data.file.type !== "application/pdf") {
            ctx.addIssue({
                code: "custom",
                path: ["file"],
                message: "Please upload a PDF",
            });
        }
    }

    if (data.resourceType === "image") {
        if (!data.file) {
            ctx.addIssue({
                code: "custom",
                path: ["file"],
                message: "File is required",
            });
        } else if (!data.file.type.startsWith("image/")) {
            ctx.addIssue({
                code: "custom",
                path: ["file"],
                message: "Please upload an image",
            });
        }
    }
});