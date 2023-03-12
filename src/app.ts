import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(cors());

type Parent = {
  name: string
  // neccessary to do server-sent events
  response: express.Response
};

const parents: Array<Parent> = [];

// Returns the connected parents
app.get("/connected", (req, res) => {
  res.send(parents.map((p) => p.name));
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
    parents.push({ name: parent, response: res });
    res.write("event: message\n");
    res.write(`data: ${parent} connected!\n`);
    res.write("\n\n");
  }
});

// Sends a notification to all connected parents
app.get("/notify", (req, res) => {
  parents.forEach(({ response }) => {
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
