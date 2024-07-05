import { db } from "../config/connectDb.js";
import jwt from "jsonwebtoken";
import moment from "moment";

// Mendapatkan semua cerita (stories)
export const getStories = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Ganti `userId` dengan `userInfo.id`
    const q = "SELECT * FROM stories ";

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addStory = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO stories(`img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Story has been created.");
    });
  });
};

export const deleteStory = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "rahasia", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM stories WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Story has been deleted.");
      return res.status(403).json("You can delete only your story!");
    });
  });
};
