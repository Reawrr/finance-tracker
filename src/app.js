const express = require('express');
const pool = require('./db/db');

const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cors = require('cors');


const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://finance-tracker.vercel.app"
  ]
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/transactions', transactionRoutes);
app.use('/categories', categoryRoutes);

app.get('/', async (req, res) => {
  const result = await pool.query(
    'SELECT NOW()'
  );

  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});