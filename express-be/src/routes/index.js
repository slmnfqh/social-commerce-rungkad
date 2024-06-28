import authRoute from "./auth/auth.js";
import collectionsRoute from "./main/collections.js";
import commentRoute from "./main/comments.js";
import express from "express";
import likeRoute from "./main/likes.js";
import multer from "multer";
import postRoute from "./main/posts.js";
import relationshipRoute from "./main/relationship.js";
import userRoute from "./main/users.js";

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../react-fe/public/upload"); //Destinasi foto ketika berhasil upload
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); //membuat format nama foto/file
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/user", userRoute);
app.use("/posts", postRoute);
app.use("/likes", likeRoute);
app.use("/comments", commentRoute);
app.use("/auth", authRoute);
app.use("/relationship", relationshipRoute);
app.use("/collections", collectionsRoute);

export default app;
