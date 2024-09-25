// const a = 7;
// const b = 9;

// console.log("helooo ts", a + b);

import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import colors from "colors";
import authRouter from "routes/userRoutes";
import { db } from "./config/db";

const app = express();

dotenv.config();

db();

app.get("/", (req, res) => {
  res.send(`<h1>Heloo app is runnig on Dev Mode</h1>`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//API ROUTES

app.use("/api/auth", authRouter);

app.use(function (err, req, res, next) {
  res.status(500).json({ message: err.message });
} as express.ErrorRequestHandler);

app.listen(8000, () => console.log(`app is running http://localhost:8000`));
