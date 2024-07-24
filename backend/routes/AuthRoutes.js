import { Router } from "express";
import { signin, signup } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);

export default authRoutes;
