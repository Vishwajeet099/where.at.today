import express from "express";
import { getAll, createOne, deleteOne } from "../../controllers/admin/genericController.js";

const router = express.Router();

router.get("/", getAll("performers"));
router.post("/", createOne("performers", ["bio"]));
router.delete("/:id", deleteOne("performers"));

export default router;