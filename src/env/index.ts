import { config } from "dotenv"
import { z } from "zod"

if(process.env.NODE_ENV === "test"){
    config({
        path: ".env.test"
    })
} else {
    config()
}

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum([
        "development",
        "test",
        "production"
    ]).default("production"),
    DATABASE_URL: z.string()
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false) {
    console.error('⚠️  Invalid Environment Variables!', _env.error)

    throw new Error("Invalid Environment Variables.")
}

export const env = _env.data