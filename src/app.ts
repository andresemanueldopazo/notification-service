import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// security headers
// TO DO: research about if these are enough safety
app.use(helmet());
// ANY site can interact with all endpoints of this service
app.use(cors());

type ConnectionId = string;

interface Connection {
  // method used to send the notification to the client
  write: express.Response["write"];
}

// shared between /connect and /notify
const Connections: Record<ConnectionId, Connection> = {};

// health
app.get("/", (req, res) => {
  res.send("Server is alive");
});

// Returns the connected ids
app.get("/connected", (req, res) => {
  res.send(Object.keys(Connections));
});

app.get("/connect", (req, res) => {
  const { id } = req.query;
  const requesterIP = req.ip;
  console.log(`Serving to ${requesterIP}...`);

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
});

// Sends a notification to a particular client if it is connected
app.get("/notify", (req, res) => {
  const { id } = req.query;
  const requesterIP = req.ip;
  console.log(`Serving to ${requesterIP}...`);

  if (typeof id !== "string") {
    console.log(`${requesterIP} did not sent 'id' query parameter`);
    res.send("error: missing 'id' in query parameters");
  } else {
    const connection = Connections[id];
    if (connection === undefined) {
      // this particular client is not connected
      res.send(`The client with id=${id} is not connected`);
    } else {
      // it is connected. send notification
      connection.write("event: message\n");
      connection.write("data: Notification!\n");
      connection.write("\n\n");
      res.send(`The client with id=${id} was notified`);
    }
  }
});

// Sends a notification to all connected clients
app.get("/notifyAll", (req, res) => {
  Object.values(Connections).forEach((connection) => {
    connection.write("event: message\n");
    connection.write("data: Notification!\n");
    connection.write("\n\n");
  });
  res.send("All ids notified");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started at port ${port}!`);
});
