import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import routes from "./src/routes/index.js";

const app = express();
const port = 3000;

// middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();``
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});
