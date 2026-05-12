import express from "express";
import { getAll, createOne } from "../../controllers/admin/genericController.js";

const router = express.Router();

router.get("/", getAll("organizers"));
router.post("/", createOne("organizers", ["description", "website"]));

export default router;