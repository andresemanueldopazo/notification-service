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

/**
 * Handler function for client connection requests.
 *
 * @param {Request} req - Request object from the client.
 * @param {Response} res - Response object to send to the client.
 *
 * Required query parameter:
 *  - id: A string representing the unique id of the client.
 *
 * Sends to the client:
 * If the 'id' is missing or not a string type, an error message is sent to the
 * client with status 400.
 * If connection is successful:
 *  - Headers are set to 'Connection: Keep-Alive'.
 *  - A message indicating successful connection is sent to to the client.
 *  - Response object res is stored in a global Connections object under the key
 * id for future reference.
 *
 * Attached handler to detect when the client closes the connection:
 * Removes the response object from the Connections object when the client closes the connection.
 */
function connectHandler(req: Request, res: Response) {
  const requesterIP = req.ip;
  console.log(`Serving to ${requesterIP}...`);

  const { id } = req.query;

  if (typeof id !== "string") {
    console.log(`${requesterIP} did not sent 'id' query parameter`);
    res.status(400).send("error: missing 'id' in query parameters");
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

/**
 * Handler function for notification requests.
 *
 * @param {Request} req - Request object from the client.
 * @param {Response} res - Response object to send to the client.
 *
 * Required query parameter:
 *   - id: A string representing the id of the client to send the notification to.
 *
 * Optional query parameters:
 *   - Anything. They will be sent to the client as JSON-formatted notification parameters.
 *
 * Sent to the client:
 *   - If the function ends with an error, it sends an error string with status 400.
 *   - If the client with the specified id is not connected, sends a message notifying
 * it's not connected.
 *   - If the client is connected, sends a message notifying it.
 *      The message contains:
 *          event: 'message'
 *          data: notification parameters in JSON format.
 */
function notifyHandler(req: Request, res: Response) {
  const requesterIP = req.ip;
  console.log(`Serving to ${requesterIP}...`);

  const { id } = req.query;

  if (typeof id !== "string") {
    console.log(`${requesterIP} did not sent 'id' query parameter`);
    res.status(400).send("error: missing 'id' in query parameters\n");
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

/**
 * Handler function for notifying all connected clients.
 *
 * @param {Request} req - Request object from the client.
 * @param {Response} res - Response object to send to the client.
 *
 * Sends a message to all connected clients notifying them.
 *
 * The message to each client contains:
 * event: 'message'
 * data: "Notification!"
 *
 * The message is sent in Server-Sent Events format.
 * Sends a message to the initiating client confirming that all connections were notified.
 */
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
