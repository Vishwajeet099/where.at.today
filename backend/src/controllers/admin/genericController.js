import pool from "../../db.js";

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

export const getAll = (table) => async (req, res) => {
  try {
    let query = `SELECT * FROM ${table}`;

    const tablesWithCreatedAt = [
      "events",
      "articles",
      "users",
    ];

    if (tablesWithCreatedAt.includes(table)) {
      query += " ORDER BY created_at DESC";
    } else {
      query += " ORDER BY name ASC";
    }

    const result = await pool.query(query);

    res.json(result.rows);
  } catch (err) {
    console.error("BACKEND ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const createOne =
  (table, fields = []) =>
  async (req, res) => {
    try {
      const data = req.body;

      if (!data.name) {
        return res.status(400).json({
          error: "Name is required",
        });
      }

      const tablesWithSlug = [
        "cities",
        "venues",
        "categories",
        "events",
        "tags",
        "organizers",
        "performers",
      ];
      const hasSlug = tablesWithSlug.includes(table);
      const slug = hasSlug ? slugify(data.name) : null;

      const existsQuery = hasSlug
        ? `SELECT * FROM ${table} WHERE slug = $1`
        : `SELECT * FROM ${table} WHERE name = $1`;
      const existsParams = hasSlug ? [slug] : [data.name];

      const exists = await pool.query(existsQuery, existsParams);

      if (exists.rows.length > 0) {
        return res.status(400).json({
          message: `${table} already exists`,
        });
      }

      const columns = hasSlug ? ["name", "slug", ...fields] : ["name", ...fields];

      const values = hasSlug
        ? [data.name, slug, ...fields.map((f) => data[f] || null)]
        : [data.name, ...fields.map((f) => data[f] || null)];

      const placeholders = columns.map(
        (_, i) => `$${i + 1}`
      );

      const result = await pool.query(
        `
        INSERT INTO ${table}
        (${columns.join(", ")})
        VALUES (${placeholders.join(", ")})
        RETURNING *
        `,
        values
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error("BACKEND ERROR:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  };

export const deleteOne = (table) => async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "ID is required",
      });
    }

    const result = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: `${table} not found`,
      });
    }

    res.json({ message: `${table} deleted successfully`, deleted: result.rows[0] });
  } catch (err) {
    console.error("BACKEND ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};