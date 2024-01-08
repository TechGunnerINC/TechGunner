import { Router } from "express";
import { post, put, get, del, getId, postComment, destroy, edit } from "../Controllers/blog.js";
import { token } from "../Middlewares/auth.js";
import { v } from "../Middlewares/valid.js";
const router = Router();
router.route("/").post(post, token, v).get(get);
router.route("/:id").get(getId).put(put, token, v).delete(del, token);

router.route("/:id/comments").post(postComment, token);

router.route("/:id/comments/:Id").put(edit, token).delete(destroy, token);
export default router;
