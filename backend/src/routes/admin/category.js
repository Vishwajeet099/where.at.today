import express from "express";
import { getAll, createOne } from "../../controllers/admin/genericController.js";

const router = express.Router();

router.get("/", getAll("categories"));
router.post("/", createOne("categories", ["icon_key", "color_hex"]));

export default router; 