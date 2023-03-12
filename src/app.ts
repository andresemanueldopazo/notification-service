import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(cors());

type Parent = {
  name: string
  response: express.Response
};

const parents: Array<Parent> = [];

// Returns the connected parents
app.get("/connected", (req, res) => {
  res.send(parents.map((p) => p.name));
});

// Add the parent to the connected list of parents
app.post("/connect", bodyParser.text(), (req, res) => {
  const parentName = req.body;
  parents.push({ name: parentName, response: res });
  res.send(`${parentName} connected!`);
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started at port ${port}!`);
});
