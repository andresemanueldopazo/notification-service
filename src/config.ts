import { ClientConfig } from "pg";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const PORT = process.env.APP_PORT ?? 5000;

const PRIVATE_ROUTES_WHITELIST: Array<string> = [
  "127.0.0.1",
];

const POSTGRES_CONFIG: ClientConfig = {
  host: process.env.PG_HOST ?? "localhost",
  port: Number(process.env.PG_PORT) ?? 5432,
  user: process.env.PG_USER ?? "postgres",
  database: process.env.PG_DATABASE_NAME ?? "postgres",
  password: process.env.PG_PASSWORD ?? "pass",
};

export { PORT, PRIVATE_ROUTES_WHITELIST, POSTGRES_CONFIG };
