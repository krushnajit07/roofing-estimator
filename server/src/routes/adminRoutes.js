import express from "express";

import {
  getLeads,
  updateConfig,
} from "../controllers/adminController.js";

import {
  requireOwnerAuth,
} from "../middleware/auth.js";

const router = express.Router();

router.use(requireOwnerAuth);

router.get("/leads", getLeads);

router.put("/config", updateConfig);

export default router;