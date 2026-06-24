const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/db');
const jwt = require('jsonwebtoken');

const router = express.Router();
//Register User
router.post('/register', async (req, res) => {
  try {

    const {
      name,
      email,
      password
    } = req.body;

    const existingUser =
      await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        `,
        [email]
      );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'Email sudah digunakan'
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const result =
      await pool.query(
        `
        INSERT INTO users (
          name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3)
        RETURNING id, name, email
        `,
        [
          name,
          email,
          hashedPassword
        ]
      );

    res.status(201).json({
      message: 'Register berhasil',
      user: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});
//Login
router.post('/login', async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (
      result.rows.length === 0
    ) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const user =
      result.rows[0];

    const isMatch =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const token =
      jwt.sign(
        {
          userId: user.id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d'
        }
      );

    res.json({
      token
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

module.exports = router;