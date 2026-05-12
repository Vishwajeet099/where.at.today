import express from "express";
const router = express.Router();
import { getVenues, createVenue } from '../../controllers/admin/venueController.js';
import { deleteOne } from '../../controllers/admin/genericController.js';

router.get("/", getVenues);
router.post("/", createVenue);
router.delete("/:id", deleteOne("venues"));

export default router; 