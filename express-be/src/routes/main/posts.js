import express from "express";
import { addPost, deletePost, getPost } from "../../controllers/posts.js";

const router = express.Router();

router.get("/", getPost);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;
