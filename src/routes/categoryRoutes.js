const express = require('express');
const pool = require('../db/db');

const {getCategories} = require('../controllers/categoryController');
const router = express.Router();

router.get('/', getCategories);


module.exports = router;