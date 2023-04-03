// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const PORT = process.env.APP_PORT ?? 5000;

const PRIVATE_ROUTES_WHITELIST: Array<string> = [
  "127.0.0.1",
];

export { PORT, PRIVATE_ROUTES_WHITELIST };
