import express from "express";
import { loginOwner } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginOwner);

export default router;