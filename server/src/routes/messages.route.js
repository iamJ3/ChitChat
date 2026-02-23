import  { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.get("/users", protectRoute, getUserForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;