import express from 'express';
import {register, login, getUser} from "../controllers/auth.controller.js";
import { validateSignup , validateLogin } from "../validators/auth.validator.js"
import { protect } from "../utils/middleware.js"

const authRouter = express.Router();



authRouter.post("/register", validateSignup, register);
authRouter.post("/login", validateLogin, login);
authRouter.get("/user", protect, getUser);



export default authRouter;