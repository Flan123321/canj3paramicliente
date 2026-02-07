import path from 'node:path'
import { defineConfig } from 'prisma/config'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),

  // Database connection for migrations
  datasource: {
    // Use DIRECT_URL for migrations (bypasses connection pooler)
    // Falls back to DATABASE_URL if DIRECT_URL is not set
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
})
