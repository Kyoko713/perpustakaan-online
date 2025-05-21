const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Halaman utama customer - daftar buku tersedia
router.get('/', async (req, res) => {
  const books = await Book.find({ available: true });
  res.render('customer/home', { books });
});

// Detail buku
router.get('/buku/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render('customer/detail', { book });
});

module.exports = router;
