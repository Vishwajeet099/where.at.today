import pool from "../../db.js";

const slugify = (text) =>
  text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

export const getVenues = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, c.name as city_name
      FROM venues v
      JOIN cities c ON v.city_id = c.id
      ORDER BY v.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createVenue = async (req, res) => {
  try {
    const {
      name,
      city_id,
      address,
      latitude,
      longitude,
      capacity,
    } = req.body;

    const slug = slugify(name);

    const exists = await pool.query(
      "SELECT * FROM venues WHERE slug=$1 AND city_id=$2",
      [slug, city_id]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Venue already exists in this city" });
    }

    const result = await pool.query(
      `INSERT INTO venues 
      (name, slug, city_id, address, latitude, longitude, capacity)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [name, slug, city_id, address, latitude, longitude, capacity]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};