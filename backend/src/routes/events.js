import express from "express";
import { getEvents } from "../controllers/eventsController.js";
import pool from "../db.js";

const router = express.Router();

router.get("/", getEvents);

// DEBUG: Show all events including past ones
router.get("/debug/all", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id,
        e.title,
        e.status,
        ei.start_at,
        NOW() as current_time,
        (ei.start_at >= NOW()) as is_future
      FROM event_instances ei
      JOIN events e ON ei.event_id = e.id
      ORDER BY ei.start_at DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;