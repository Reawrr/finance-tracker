const pool = require('../db/db');

const getCategories = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        id,
        name,
        type
      FROM categories
      ORDER BY name
    `);

    res.json(result.rows);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

module.exports = {getCategories}