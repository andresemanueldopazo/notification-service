import { Client } from "pg";
import { validate } from "email-validator";

import { ConnectionId } from "./entities";
import { POSTGRES_CONFIG } from "../config";

async function isAuthorizedToConnect(id: ConnectionId): Promise<boolean> {
  if (!validate(id)) {
    return false;
  }
  const pgClient = new Client(process.env.PG_CONNECTION_URL || POSTGRES_CONFIG);
  await pgClient.connect();
  const response = await pgClient.query(
    `SELECT "email" FROM "User" WHERE "User"."email"='${id}';`,
  );
  pgClient.end();
  return response.rows?.length > 0;
}

// eslint-disable-next-line import/prefer-default-export
export { isAuthorizedToConnect };
