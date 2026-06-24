const express = require('express');
const pool = require('../db/db');

const {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById
} = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', authMiddleware, getTransactions);

router.post('/', authMiddleware, createTransaction);

router.get('/:id', authMiddleware, getTransactionById);

router.put('/:id', authMiddleware, updateTransactionById);

router.delete('/:id', authMiddleware, deleteTransactionById);
module.exports = router;