import express from "express";
import cors from "cors";

import { PRIVATE_ROUTES_WHITELIST } from "../../config";
import {
  connectedHandler,
  connectHandler,
  notifyHandler,
  notifyAllHandler,
} from "./handlers";

const router = express.Router();

router.use(cors({
  origin: PRIVATE_ROUTES_WHITELIST,
}));

// Returns the connected ids
router.get("/connected", connectedHandler);

// Connects the given id
// required query param: 'id'
router.get("/connect", connectHandler);

// Sends a notification to a particular client if it is connected
// // required query param: 'id'
router.get("/notify", notifyHandler);

// Sends a notification to all connected clients
router.get("/notifyAll", notifyAllHandler);

export default router;
