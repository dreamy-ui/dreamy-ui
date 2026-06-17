import { z } from "zod";

const requiredInProduction: z.RefinementEffect<string | undefined>["refinement"] = (value, ctx) => {
    if (process.env.NODE_ENV === "production" && !value) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Missing required environment variable " + ctx.path.join(".")
        });
    }
};

const envSchema = z.object({
    NODE_ENV: z.literal(
        z.union([z.literal("development"), z.literal("production")]).parse(process.env.NODE_ENV)
    ),

    // GitHub repo used for source links in the docs UI
    VITE_SOURCE_REPO: z.string().optional().superRefine(requiredInProduction),

    DATABASE_URL: z.string().default("file:./prisma/dev.db")
});

export const env = envSchema.parse(process.env);
