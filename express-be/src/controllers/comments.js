import jwt from "jsonwebtoken";
import moment from "moment";
import { db } from "../config/connectDb.js";

export const getComment = async (req, res) => {
  const q = `SELECT c.*, u.id AS userId, username, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.commentUserId) WHERE c.postId = ? ORDER BY c.createdAt DESC`;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    // console.log(data);
    return res.status(200).json(data);
  });
  // console.log(userInfo);
};

export const addComment = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return await res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO comments(`desc`,`createdAt`, `commentUserId`, `postId`) VALUES (?)";

    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err.message);
      // console.log(data);
      return res.status(200).json(`Comment has been created!`);
    });
  });
};
