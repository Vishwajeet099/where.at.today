import express from "express";
const router = express.Router();
import { getVenues, createVenue } from '../../controllers/admin/venueController.js';

router.get("/", getVenues);
router.post("/", createVenue);

export default router; 