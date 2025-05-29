import * as dotenv from "dotenv";
dotenv.config();

import * as Sentry from "@sentry/nestjs"

Sentry.init({
    dsn: process.env.SENTRY_DSN || 'https://sentry.example.com/123456',
    environment: process.env.NODE_ENV || 'development',
    sendDefaultPii: true,
});