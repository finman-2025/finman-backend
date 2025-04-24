export type AppConfig = {
  env: string;
  host: string;
  port: number;
  payloadLimit: string;
};

export default () => {
  const app: AppConfig = {
    env: process.env.NODE_ENV ?? 'development',
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
    payloadLimit: process.env.PAYLOAD_LIMIT,
  };

  return { app };
};
