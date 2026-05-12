import express from "express";
import { getAll, createOne, deleteOne } from "../../controllers/admin/genericController.js";

const router = express.Router();

router.get("/", getAll("categories"));
router.post("/", createOne("categories", ["icon_key", "color_hex"]));
router.delete("/:id", deleteOne("categories"));

export default router; 