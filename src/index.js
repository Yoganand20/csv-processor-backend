import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

import express from "express";
import cors from "cors";

import uploadRouter from "./routes/upload.routes.js";
import statusRouter from "./routes/status.router.js";
import mongoose from "mongoose";

const app = express();

app.use(cors());

app.post("/upload", uploadRouter);

app.use("/status", statusRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
