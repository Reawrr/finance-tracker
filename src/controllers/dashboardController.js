const pool = require('../db/db');

const getDashboard = async (req, res) => {
    try {

    const userId = req.user.userId;
    const [incomeResult, expenseResult, categoryResult] = await Promise.all([ 
    pool.query(`
      SELECT COALESCE(
        SUM(t.amount),
        0
      ) AS total_income
      FROM transactions t
      JOIN categories c
      ON t.category_id = c.id
      WHERE c.type = 'income'
      AND t.user_id = $1
    `,[userId]),
    pool.query(`
      SELECT COALESCE(
        SUM(t.amount),
        0
      ) AS total_expense
      FROM transactions t
      JOIN categories c
      ON t.category_id = c.id
      WHERE c.type = 'expense'
      AND t.user_id = $1
    `,[userId]),
    pool.query(`
        SELECT
            c.name,
            SUM(t.amount) AS total
        FROM transactions t
        JOIN categories c
        ON t.category_id = c.id
        WHERE c.type = 'expense'
        AND t.user_id = $1
        GROUP BY c.name
        ORDER BY total DESC
    `,[userId])

    ]);

    const monthlyResult = await pool.query(
      `
      SELECT
        TO_CHAR(
          transaction_date,
          'YYYY-MM'
        ) AS month,
        SUM(amount) AS total
      FROM transactions t
      JOIN categories c
      ON c.id = t.category_id
      WHERE
        t.user_id = $1
        AND c.type = 'expense'
      GROUP BY month
      ORDER BY month
      `,
      [userId]
    );
    
    const totalIncome =
      Number(incomeResult.rows[0].total_income);

    const totalExpense =
      Number(expenseResult.rows[0].total_expense);

    const balance =
      totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance,
      expensesByCategory: categoryResult.rows,
      monthlyExpenses: monthlyResult.rows
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

module.exports = {
  getDashboard
};