import pool from "../db.js";

export const getEvents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id,
        e.slug,
        e.title,
        e.description,

        ei.start_at,
        ei.end_at,

        v.name AS venue,
        v.address,
        v.latitude,
        v.longitude,

        c.name AS city,
        c.country,

        em.media_url AS image,

        ts.name AS seller,
        COALESCE(NULLIF(et.ticket_url, ''), ts.website) AS ticket_url,
        et.price

      FROM event_instances ei
      JOIN events e ON ei.event_id = e.id
      JOIN venues v ON ei.venue_id = v.id
      JOIN cities c ON e.city_id = c.id

      LEFT JOIN event_media em 
        ON e.id = em.event_id AND em.is_hero = true

      LEFT JOIN event_tickets et 
        ON ei.id = et.event_instance_id

      LEFT JOIN ticket_sellers ts 
        ON et.seller_id = ts.id

      WHERE e.status = 'published'
      AND ei.start_at >= NOW()

      ORDER BY ei.start_at ASC
      LIMIT 20;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};