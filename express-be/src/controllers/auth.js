import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/connectDb.js";

export const register = async (req, res) => {
  const q = `SELECT * FROM users WHERE username = ? OR email = ?`;
  const value = [req.body.username, req.body.email];

  // check if user exists
  db.query(q, value, (err, data) => {
    if (err) return res.status(500).json(err.message);
    if (data.length) {
      const existingUser = data[0];
      if (existingUser.username === req.body.username) {
        return res.status(409).json(`Username already exists!`);
      } else if (existingUser.email === req.body.email) {
        return res.status(409).json(`Email already exists!`);
      }
    }
    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // insert/create user
    const q = `INSERT INTO users(username, email, password, name) VALUES(?)`;
    const values = [req.body.username, req.body.email, hash, req.body.name];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err.message);
      return res.status(200).json(`Registered successfully!`);
    });
  });
};

export const login = (req, res) => {
  const q = `SELECT * FROM users WHERE username = ?`;

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err.message);

    if (data.length === 0) return res.status(404).json("user not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword) return res.status(400).json("wrong password!");

    const token = jwt.sign({ id: data[0].id, name: data[0].name }, "rahasia");
    const { password, ...other } = data[0];
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json(`Success logout!`);
};
