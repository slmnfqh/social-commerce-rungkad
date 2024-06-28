import jwt from "jsonwebtoken";
import { query } from "express";
import { db } from "../config/connectDb.js";

export const getUsers = async (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM users WHERE id = ?";

  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data && data.length > 0) {
      // Memastikan 'data[0]' terdefinisi dan tidak kosong
      const { password, ...info } = data[0];
      console.log(info);
      return res.status(200).json(info);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
};

export const updateUsers = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return await res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `username`=?,`name`=?, `city`=?, `bio`=?, `profilePic`=?, `coverPic`=? WHERE id = ?";

    const values = [
      // req.body.email,
      // req.body.password,
      req.body.username,
      req.body.name,
      req.body.city,
      req.body.bio,
      req.body.profilePic,
      req.body.coverPic,
      userInfo.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) {
        return res.status(200).json("Account has been updated!");
      }
      return res.status(403).json("You can't update this account!");
    });
  });
};

export const searchUsers = async (req, res) => {
  const { query } = req.query;
  const q = "SELECT * FROM users WHERE username LIKE ? OR name LIKE ?";

  db.query(q, [`%${query}%`, `%${query}%`], (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while searching users." });
    }

    if (data && data.length > 0) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "No users found" });
    }
  });
};
