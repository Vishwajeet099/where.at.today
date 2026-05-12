import express from "express";
import { getAll, createOne } from "../../controllers/admin/genericController.js";

const router = express.Router();

router.get("/", getAll("cities"));
router.post("/", createOne("cities", ["country", "timezone"]));

export default router;