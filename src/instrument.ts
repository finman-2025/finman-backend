import * as Sentry from "@sentry/nestjs"

console.log('All env parameters:', process.env);

Sentry.init({
    dsn: process.env.SENTRY_DSN || 'https://sentry.example.com/123456',
    environment: process.env.NODE_ENV || 'development',
    sendDefaultPii: true,
});