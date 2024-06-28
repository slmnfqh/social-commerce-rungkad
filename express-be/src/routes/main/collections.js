import express from "express";

import {
  addCollection,
  getCollection,
  getCollectionsByUserId,
} from "../../controllers/collections.js";

const router = express.Router();

router.get("/", getCollection);
router.get("/user", getCollectionsByUserId);
router.post("/", addCollection);

export default router;
