import { z } from "zod";

const requiredInProduction: z.RefinementEffect<string | undefined>["refinement"] = (value, ctx) => {
    if (process.env.NODE_ENV === "production" && !value) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Missing required environment variable " + ctx.path.join(".")
        });
    }
};

const requiredInDevelopment: z.RefinementEffect<string | undefined>["refinement"] = (
    value,
    ctx
) => {
    if (process.env.NODE_ENV === "development" && !value) {
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

    // A token to increase the rate limiting from 60/hr to 1000/hr
    GITHUB_TOKEN: z.string().optional().superRefine(requiredInProduction),

    // GitHub repo to pull docs from
    VITE_SOURCE_REPO: z.string().optional().superRefine(requiredInProduction),

    // Redis database url to use instead of lru in-memory cache
    REDIS_URL: z.string().optional()
});

export const env = envSchema.parse(process.env);
