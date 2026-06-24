const pool = require('../db/db');

//GET /
const getTransactions = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || '';
    const from = req.query.from;
    const to = req.query.to;

    let sort = req.query.sort || 'transaction_date';
    let order = req.query.order || 'desc';

    //whitelist
    const allowedSort = ['amount', 'transaction_date'];
    const allowedOrder = ['asc', 'desc'];

    if (!allowedSort.includes(sort)) {
      sort = 'transaction_date';
    }

    if (!allowedOrder.includes(order)) {
      order = 'desc';
    }

    let conditions = ['t.user_id = $1'];
    let values = [req.user.userId];
    let index = 2;

    //Search filter
    if (search) {
        conditions.push(`t.description ILIKE $${index}`);
        values.push(`%${search}%`);
        index++;
    }
    //berdasarkan tanggal
    if (from) {
        conditions.push(`t.transaction_date >= $${index}`);
        values.push(from);
        index++;
    }

    if (to) {
        conditions.push(`t.transaction_date <= $${index}`);
        values.push(to);
        index++;
    }

    const whereClause = conditions.join(' AND ');

    const result = await pool.query(`
      SELECT
        t.id,
        t.category_id,
        c.name AS category,
        c.type,
        t.amount,
        t.description,
        t.transaction_date
      FROM transactions t
      JOIN categories c
      ON t.category_id = c.id
      WHERE ${whereClause}
      ORDER BY t.transaction_date DESC
      LIMIT $${index} OFFSET $${index + 1}
    `, [...values, limit, offset]);

    const countResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM transactions t
      WHERE ${whereClause}
      `,
      values
    );

    const totalData = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalData / limit);

    res.json({
      page,
      limit,
      totalData,
      totalPages,
      data: result.rows
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};
//POST /
const createTransaction = async (req, res) => {
    try {

    const {
      category_id,
      amount,
      description,
      transaction_date
    } = req.body;

    const userId = req.user.userId;

    if (
      !category_id ||
      !amount ||
      !transaction_date
    ) {
      return res.status(400).json({
        error: 'Required fields are missing'
      });
    }

    const result = await pool.query(
      `
      INSERT INTO transactions (
        user_id,
        category_id,
        amount,
        description,
        transaction_date
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        userId,
        category_id,
        amount,
        description,
        transaction_date
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};
//GET (id) /
const getTransactionById = async (req, res) => {
    try {

    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM transactions
      WHERE id = $1
      AND user_id = $2
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Transaction not found'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};
//PUT (id) /
const updateTransactionById = async (req, res) => {
    try {
    
    const userId = req.user.userId;
    const { id } = req.params;

    const {
      category_id,
      amount,
      description,
      transaction_date
    } = req.body;

    const result = await pool.query(
      `
      UPDATE transactions
      SET
        category_id = $1,
        amount = $2,
        description = $3,
        transaction_date = $4
      WHERE id = $5
      AND user_id = $6
      RETURNING *
      `,
      [
        category_id,
        amount,
        description,
        transaction_date,
        id,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Transaction not found'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};
//DELETE (id) /
const deleteTransactionById = async (req, res) => {
    try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM transactions
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Transaction not found'
      });
    }

    res.json({
      message: 'Transaction deleted successfully'
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({
      error: error.message
    });

  }
};
module.exports = {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById
};