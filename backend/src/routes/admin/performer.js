import express from "express";
import { getAll, createOne } from "../../controllers/admin/genericController.js";

const router = express.Router();

router.get("/", getAll("performers"));
router.post("/", createOne("performers", ["bio"]));

export default router;