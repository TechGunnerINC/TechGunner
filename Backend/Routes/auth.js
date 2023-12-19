import { Router } from "express";
import { login, newUser } from "../Controllers/user.js";

const router = Router();

router.route("/signup").post(newUser);
router.route("/login").post(login);

export default router;