import pool from "../../db.js";

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const upsertEntity = async (table, name, bio = null, website = null) => {
  const slug = slugify(name);

  const exists = await pool.query(
    `SELECT * FROM ${table} WHERE slug = $1`,
    [slug]
  );

  if (exists.rows.length > 0) {
    return exists.rows[0].id;
  }

  let query = `INSERT INTO ${table} (name, slug`;
  let values = [name, slug];
  let placeholders = ["$1", "$2"];

  if (bio) {
    query += ", bio";
    values.push(bio);
    placeholders.push(`$${placeholders.length + 1}`);
  }
  if (website) {
    query += ", website";
    values.push(website);
    placeholders.push(`$${placeholders.length + 1}`);
  }

  query += `) VALUES (${placeholders.join(", ")}) RETURNING id`;

  const result = await pool.query(query, values);
  return result.rows[0].id;
};

const upsertVenue = async (cityId, name, address = null) => {
  const slug = slugify(name);

  const exists = await pool.query(
    `SELECT * FROM venues WHERE slug = $1`,
    [slug]
  );

  if (exists.rows.length > 0) {
    return exists.rows[0].id;
  }

  const result = await pool.query(
    `INSERT INTO venues (city_id, name, slug, address)
    VALUES ($1, $2, $3, $4) RETURNING id`,
    [cityId, name, slug, address]
  );

  return result.rows[0].id;
};

export const getEvents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id,
        e.slug,
        e.title,
        e.description,
        e.status,
        c.name AS city_name,
        COUNT(DISTINCT ei.id) AS instance_count,
        e.created_at
      FROM events e
      LEFT JOIN cities c ON e.city_id = c.id
      LEFT JOIN event_instances ei ON e.id = ei.event_id
      GROUP BY e.id, e.slug, e.title, e.description, e.status, c.name, e.created_at
      ORDER BY e.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const createEvent = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      title,
      description,
      city_id,
      status = "published",
      instances = [],
      performers = [],
      organizers = [],
      categories = [],
      media = [],
    } = req.body;

    if (!title || !city_id) {
      return res.status(400).json({
        message: "Title and city are required",
      });
    }

    if (instances.length === 0) {
      return res.status(400).json({
        message: "At least one event instance is required",
      });
    }

    const slug = slugify(title);

    const eventExists = await client.query(
      `SELECT * FROM events WHERE slug = $1`,
      [slug]
    );

    if (eventExists.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Event with this title already exists",
      });
    }

    // Create event
    const eventResult = await client.query(
      `INSERT INTO events (title, slug, description, city_id, status)
      VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [title, slug, description, city_id, status]
    );

    const eventId = eventResult.rows[0].id;

    // Create instances
    for (const instance of instances) {
      if (!instance.venue_id || !instance.start_at) {
        throw new Error("Venue and start_at are required for each instance");
      }

      let venueId = instance.venue_id;

      // If venue is an object with name, upsert it
      if (typeof instance.venue_id === "object" && instance.venue_id.name) {
        venueId = await upsertVenue(
          city_id,
          instance.venue_id.name,
          instance.venue_id.address
        );
      }

      const instanceResult = await client.query(
        `INSERT INTO event_instances (event_id, venue_id, start_at, end_at)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [eventId, venueId, instance.start_at, instance.end_at || null]
      );

      const instanceId = instanceResult.rows[0].id;

      // Add tickets for this instance
      if (instance.tickets && instance.tickets.length > 0) {
        for (const ticket of instance.tickets) {
          if (
            !ticket.seller_id ||
            ticket.price === undefined ||
            ticket.price === null ||
            ticket.price === ""
          ) {
            continue;
          }

          // Get seller details to get the website/ticket URL
          const sellerResult = await client.query(
            `SELECT id, website FROM ticket_sellers WHERE id = $1`,
            [ticket.seller_id]
          );

          if (sellerResult.rows.length === 0) continue;

          const seller = sellerResult.rows[0];
          const ticketUrl = ticket.ticket_url?.trim() || seller.website;

          if (!ticketUrl) continue;

          // Create ticket entry
          await client.query(
            `INSERT INTO event_tickets (event_instance_id, seller_id, ticket_url, price)
            VALUES ($1, $2, $3, $4)`,
            [instanceId, ticket.seller_id, ticketUrl, ticket.price]
          );
        }
      }
    }

    // Link performers
    for (const performer of performers) {
      let performerId = performer.id;

      if (!performerId && performer.name) {
        performerId = await upsertEntity("performers", performer.name, performer.bio);
      }

      if (performerId) {
        await client.query(
          `INSERT INTO event_performers (event_id, performer_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING`,
          [eventId, performerId]
        );
      }
    }

    // Link organizers
    for (const organizer of organizers) {
      let organizerId = organizer.id;

      if (!organizerId && organizer.name) {
        organizerId = await upsertEntity(
          "organizers",
          organizer.name,
          null,
          organizer.website
        );
      }

      if (organizerId) {
        await client.query(
          `INSERT INTO event_organizers (event_id, organizer_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING`,
          [eventId, organizerId]
        );
      }
    }

    // Link categories
    for (const categoryId of categories) {
      await client.query(
        `INSERT INTO event_categories (event_id, category_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING`,
        [eventId, categoryId]
      );
    }

    // Add media
    for (const mediaItem of media) {
      if (mediaItem.media_url) {
        await client.query(
          `INSERT INTO event_media (event_id, media_url, is_hero)
          VALUES ($1, $2, $3)`,
          [eventId, mediaItem.media_url, mediaItem.is_hero || false]
        );
      }
    }

    await client.query("COMMIT");

    res.json({
      id: eventId,
      title,
      slug,
      description,
      city_id,
      status,
      message: "Event created successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const result = await pool.query(
      `UPDATE events SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM events WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
