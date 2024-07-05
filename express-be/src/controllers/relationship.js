import jwt from "jsonwebtoken";
import { query } from "express";
import { db } from "../config/connectDb.js";

export const getRelationship = async (req, res) => {
  const q = `SELECT DISTINCT followerUserId FROM relationships WHERE followedUserId = ?`;

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    // console.log(data);
    return res
      .status(200)
      .json(data.map((relationships) => relationships.followerUserId));
  });
};

export const addRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return await res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Check if relationship already exists
    const checkQuery =
      "SELECT * FROM relationships WHERE followerUserId = ? AND followedUserId = ?";
    const checkValues = [userInfo.id, req.body.userId];

    db.query(checkQuery, checkValues, (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length > 0) {
        return res.status(400).json("Relationship already exists.");
      }

      // Proceed with INSERT operation
      const insertQuery =
        "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?, ?)";
      const insertValues = [userInfo.id, req.body.userId];

      db.query(insertQuery, insertValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Following success!");
      });
    });
  });
};

export const deleteRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return await res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?";
    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Success unfollow!");
    });
  });
};
