import express from "express";
import multer from "multer";
import fs from "fs";
import uploadCSV from "../controller/upload.controller.js";

const upload = multer({ dest: "uploads/" });

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const uploadRouter = express.Router();

uploadRouter.post("/upload", upload.single("csv_file"), uploadCSV);

export default uploadRouter;
