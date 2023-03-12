import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(cors());

// for now use the parent name
type ParentId = string;
// shared between /connect and /notify
const Parents: Record<ParentId, express.Response> = {};

// Returns the connected parents
app.get("/connected", (req, res) => {
  res.send(Object.keys(Parents));
});

// Add the parent to the connected list of parents
app.get("/connect", (req, res) => {
  const { parent } = req.query;

  if (typeof parent !== "string") {
    res.send("parent query parameter needed!");
  } else {
    // neccessary headers to keep alive the http connection
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      // eslint-disable-next-line quote-props
      "Connection": "keep-alive",
    });
    // store the response object to send notifications when needed
    Parents[parent] = res;
    // tell parent that it has been connected
    res.write("event: message\n");
    res.write(`data: ${parent} connected!\n`);
    res.write("\n\n");
    // attach handler when client closes the connection
    req.on("close", () => {
      console.log(`Parent ${parent} discnnected`);
      delete Parents[parent];
    });
  }
});

// Sends a notification to all connected parents
app.get("/notify", (req, res) => {
  Object.values(Parents).forEach((response) => {
    response.write("event: message\n");
    response.write("data: Notification!\n");
    response.write("\n\n");
  });
  res.send("All parents notified");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started at port ${port}!`);
});
