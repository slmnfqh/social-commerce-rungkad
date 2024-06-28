import jwt from "jsonwebtoken";
import moment from "moment";
import { db } from "../config/connectDb.js";

export const getCollection = (req, res) => {
  const q = "SELECT * FROM collections WHERE postId = ?";
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((collection) => collection.userId));
  });
};

export const getCollectionsByUserId = (req, res) => {
  const userId = req.query.userId;
  const q = `
    SELECT collections.*, posts.img, posts.desc 
    FROM collections 
    JOIN posts ON collections.postId = posts.id 
    WHERE collections.userId = ?
  `;

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addCollection = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return await res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO collections(`postId`, `userId`) VALUES (?)";

    const values = [req.body.postId, userInfo.id];

    db.query(q, [values], (err, data) => {
      if (data.affectedRows > 0) return res.status(200).json(data);
      return res.status(500).json(err);
    });
  });
};
