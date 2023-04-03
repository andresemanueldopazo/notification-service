// import { Client } from "pg";

import { ConnectionId } from "./entities";
// import { POSTGRES_CONFIG } from "../config";

async function isAuthorizedToConnect(id: ConnectionId): Promise<boolean> {
  // const pgClient = new Client(POSTGRES_CONFIG);
  // await pgClient.connect();
  // const response = await pgClient.query(
  //   `SELECT "sessionToken" FROM "Session" WHERE "sessionToken"='${id}'`,
  // );
  // pgClient.end();
  // return response.rows?.[0]?.sessionToken === id;
  return true;
}

// eslint-disable-next-line import/prefer-default-export
export { isAuthorizedToConnect };
