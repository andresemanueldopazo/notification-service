import express from "express";
import cors from "cors";

import { healthHandler } from "./handlers";

const router = express.Router();

// no restriction
router.use(cors());

router.get("/health", healthHandler);

export default router;
