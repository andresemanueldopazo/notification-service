import { Request, Response } from "express";

type ConnectionId = string;

interface Connection {
  // method used to send the notification to the client
  write: Response["write"];
}

// shared between /connect and /notify*
const Connections: Record<ConnectionId, Connection> = {};

function connectedHandler(req: Request, res: Response) {
  res.send(Object.keys(Connections));
}

function connectHandler(req: Request, res: Response) {
  const requesterIP = req.ip;
  console.log(`Serving to ${requesterIP}...`);

  const { id } = req.query;

  if (typeof id !== "string") {
    console.log(`${requesterIP} did not sent 'id' query parameter`);
    res.send("error: missing 'id' in query parameters");
  } else {
    // neccessary headers to keep alive the http connection
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      // eslint-disable-next-line quote-props
      "Connection": "keep-alive",
    });
    // store the response object to send notifications when needed
    Connections[id] = res;
    // tell parent that it has been connected
    res.write("event: message\n");
    res.write(`data: ${id} connected\n`);
    res.write("\n\n");
    // attach handler when client closes the connection
    req.on("close", () => {
      console.log(`${id} disconnected`);
      delete Connections[id];
    });
  }
}

function notifyHandler(req: Request, res: Response) {
  const requesterIP = req.ip;
  console.log(`Serving to ${requesterIP}...`);

  const { id } = req.query;

  if (typeof id !== "string") {
    console.log(`${requesterIP} did not sent 'id' query parameter`);
    res.send("error: missing 'id' in query parameters\n");
  } else {
    const connection = Connections[id];
    if (connection === undefined) {
      // this particular client is not connected
      res.send(`The client with id=${id} is not connected\n`);
    } else {
      // it is connected!
      // the notification contents will be all the query params received
      // BUT without the id
      const notificationContents = { ...req.query };
      delete notificationContents.id;
      // send notification contents
      connection.write("event: message\n");
      connection.write(`data: ${JSON.stringify(notificationContents)}\n`);
      connection.write("\n\n");
      res.send(`The client with id=${id} was notified\n`);
    }
  }
}

function notifyAllHandler(req: Request, res: Response) {
  Object.values(Connections).forEach((connection) => {
    connection.write("event: message\n");
    connection.write("data: Notification!\n");
    connection.write("\n\n");
  });
  res.send("All ids notified\n");
}

export {
  connectedHandler,
  connectHandler,
  notifyHandler,
  notifyAllHandler,
};
