import express from "express";
import { token } from "./Middlewares/auth.js";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import blog from "./Routes/blogs.js";
import user from "./Routes/user.js";
import auth from "./Routes/auth.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
//app.use(token);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use("/blog", blog);
app.use("/profile", user);
app.use("/auth", auth);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
