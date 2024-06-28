import express from "express";
import { getUsers, updateUsers, searchUsers } from "../../controllers/users.js";

const router = express.Router();

router.get("/find/:id", getUsers);
router.patch("/", updateUsers);
router.get("/search", searchUsers);

export default router;
