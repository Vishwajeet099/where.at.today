import express from "express";
import { getAll, createOne, deleteOne } from "../../controllers/admin/genericController.js";

const router = express.Router();

router.get("/", getAll("organizers"));
router.post("/", createOne("organizers", ["description", "website"]));
router.delete("/:id", deleteOne("organizers"));

export default router;