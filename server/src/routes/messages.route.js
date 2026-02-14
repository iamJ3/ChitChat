import express, { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;