import express from "express";
import {
  getEvents,
  createEvent,
  updateEventStatus,
  deleteEvent,
} from "../../controllers/admin/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", createEvent);
router.patch("/:id/status", updateEventStatus);
router.delete("/:id", deleteEvent);

export default router;
