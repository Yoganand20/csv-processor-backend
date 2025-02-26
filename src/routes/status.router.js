import express from "express";
import getStatus from "../controller/status.controller.js";

const statusRouter = express.Router();

statusRouter.get("/:requestId", getStatus);

export default statusRouter;