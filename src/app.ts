import express from "express";
import helmet from "helmet";

import { PORT } from "./config";
import privateRoutes from "./routes/private";
import publicRoutes from "./routes/public";
import bodyParser from "body-parser"

const app = express();

app.use(bodyParser.json())

// security headers
// TO DO: research about if these are enough safety
app.use(helmet());

app.use(publicRoutes);
app.use(privateRoutes);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}!`);
});
