import { Response } from "express";

type ConnectionId = string;

interface Connection {
  // method used to send the notification to the client
  write: Response["write"];
}

export { Connection, ConnectionId };
