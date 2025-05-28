import * as dotenv from "dotenv";
dotenv.config();

import * as Sentry from "@sentry/nestjs"

Sentry.init({
    dsn: process.env.SENTRY_DSN || 'https://sentry.example.com/123456',
    environment: process.env.NODE_ENV || 'development',

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});