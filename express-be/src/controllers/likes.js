import jwt from "jsonwebtoken";
import { query } from "express";
import { db } from "../config/connectDb.js";

export const getLike = async (req, res) => {
  const q = `SELECT likeUserId FROM likes WHERE likePostId = ? `;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    // console.log(data);
    return res.status(200).json(data.map((like) => like.likeUserId));
  });
};

export const addLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return await res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO likes(`likeUserId`,`likePostId`) VALUES (?)";

    const values = [userInfo.id, req.body.postId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err.message);
      // console.log(data);
      return res.status(200).json(`post has been liked!`);
    });
  });
};

export const deleteLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return await res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM likes WHERE likeUserId = ? AND likePostId = ?";

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err.message);
      // console.log(data);
      return res.status(200).json(`post has been disliked!`);
    });
  });
};
