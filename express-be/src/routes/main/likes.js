import express from "express";
import { addLike, deleteLike, getLike } from "../../controllers/likes.js";

const router = express.Router();

router.get("/", getLike);
router.post("/", addLike);
router.delete("/", deleteLike);

export default router;
