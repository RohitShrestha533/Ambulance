import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import session from "express-session";
import { connectDB } from "./db/connectDB.js";

import Routes from "./routes/route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8081",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use((err, req, res, next) => {
  if (err.message && err.message.includes("CORS")) {
    console.error("CORS error: ", err);
    return res.status(403).send("CORS error: Request blocked.");
  }
  next(err);
});

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "2019/08/26",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/", Routes);
app.get("/", (req, res) => {
  res.send("hi");
});
app.listen(PORT, "0.0.0.0", () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
