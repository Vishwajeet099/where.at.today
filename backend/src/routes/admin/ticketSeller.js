import express from "express";
import { getAll, createOne, deleteOne } from "../../controllers/admin/genericController.js";

const router = express.Router();

router.get("/", getAll("ticket_sellers"));
router.post("/", createOne("ticket_sellers", ["website"]));
router.delete("/:id", deleteOne("ticket_sellers"));

export default router;