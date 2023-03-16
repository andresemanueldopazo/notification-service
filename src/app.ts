import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

// security headers
// TO DO: research about if these are enough safety
app.use(helmet());
// ANY site can interact with all endpoints of this service
app.use(cors());

type ConnectionId = string;

interface Connection {
  write: express.Response["write"]
}

// shared between /connect and /notify
const Connections: Record<ConnectionId, Connection> = {};

// Returns the connected ids
app.get("/connected", (req, res) => {
  res.send(Object.keys(Connections));
});

app.get("/connect", cookieParser(), (req, res) => {
  const { id } = req.cookies;

  if (typeof id !== "string") {
    res.send("error: missing 'id' key in cookies");
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
    res.write(`data: ${id}\n`);
    res.write("\n\n");
    // attach handler when client closes the connection
    req.on("close", () => {
      console.log(`${id} disconnected`);
      delete Connections[id];
    });
  }
});

// Sends a notification to all connected parents
app.get("/notify", (req, res) => {
  Object.values(Connections).forEach((connection) => {
    connection.write("event: message\n");
    connection.write("data: Notification!\n");
    connection.write("\n\n");
  });
  res.send("All parents notified");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started at port ${port}!`);
});
