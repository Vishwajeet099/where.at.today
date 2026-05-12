import express from "express";
import { getAll, createOne, deleteOne } from "../../controllers/admin/genericController.js";

const router = express.Router();

router.get("/", getAll("tags"));
router.post("/", createOne("tags", []));
router.delete("/:id", deleteOne("tags"));

export default router;