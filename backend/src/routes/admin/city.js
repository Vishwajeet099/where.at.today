import express from "express";
import { getAll, createOne, deleteOne } from "../../controllers/admin/genericController.js";

const router = express.Router();

router.get("/", getAll("cities"));
router.post("/", createOne("cities", ["country", "timezone"]));
router.delete("/:id", deleteOne("cities"));

export default router;