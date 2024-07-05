import jwt from "jsonwebtoken";
import moment from "moment";
import { db } from "../config/connectDb.js";

export const getPost = async (req, res) => {
  const { userId } = req.query;

  const token = req.cookies.accessToken;
  if (!token) return await res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    let q;
    let values;

    if (userId !== undefined && userId !== "undefined") {
      // Get posts by specific userId
      q = `SELECT p.*, u.id AS userId, username, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`;
      values = [userId];
    } else {
      // Get posts by followed users or self
      q = `
        SELECT DISTINCT p.*, u.id AS userId, username, profilePic 
        FROM posts AS p 
        JOIN users AS u ON (u.id = p.userId) 
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) 
        WHERE r.followerUserId = ? OR p.userId = ? 
        ORDER BY p.createdAt DESC
      `;
      values = [userInfo.id, userInfo.id];
    }

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return await res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`desc`, `img`, `userId`, `createdAt`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err.message);
      return res.status(200).json(`Success add post!`);
    });
  });
};

export const deletePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Hapus referensi di tabel collections
    const deleteCollectionsQuery = "DELETE FROM collections WHERE `postId` = ?";
    db.query(deleteCollectionsQuery, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err.message);

      // Hapus post setelah referensi di tabel collections dihapus
      const deletePostQuery =
        "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";
      db.query(deletePostQuery, [req.params.id, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err.message);
        if (data.affectedRows > 0)
          return res.status(200).json("Success delete post!");
        return res.status(403).json("You can delete only your post!");
      });
    });
  });
};
