import express from "express";
import { getAll, createOne } from "../../controllers/admin/genericController.js";

const router = express.Router();

router.get("/", getAll("ticket_sellers"));
router.post("/", createOne("ticket_sellers", ["website"]));

export default router;