export type AppConfig = {
  env: string;
  host: string;
  port: number;
  payloadLimit: string;
  corsOrigin: string | string[];
};

export default () => {
  const app: AppConfig = {
    env: process.env.NODE_ENV ?? 'development',
    host: process.env.HOST ?? '0.0.0.0',
    port: parseInt(process.env.PORT ?? '8080'),
    payloadLimit: process.env.PAYLOAD_LIMIT ?? '50mb',
    corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  };

  return { app };
};
