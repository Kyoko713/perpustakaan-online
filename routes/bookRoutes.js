const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Menampilkan daftar buku
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.render('index', { books });
  } catch (err) {
    res.status(500).send('Error fetching books');
  }
});

// Menambahkan buku baru
router.post('/add', async (req, res) => {
  const { title, author, year } = req.body;
  const newBook = new Book({ title, author, year });
  
  try {
    await newBook.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error adding book');
  }
});

// Meminjam buku
router.post('/borrow/:id', async (req, res) => {
  try {
    await Book.findByIdAndUpdate(req.params.id, { available: false });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error borrowing book');
  }
});

// Mengembalikan buku
router.post('/return/:id', async (req, res) => {
  try {
    await Book.findByIdAndUpdate(req.params.id, { available: true });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error returning book');
  }
});

module.exports = router;
router.get('/dummy', async (req, res) => {
    try {
      await Book.insertMany([
        { title: 'Laskar Pelangi', author: 'Andrea Hirata', year: 2005 },
        { title: 'Negeri 5 Menara', author: 'Ahmad Fuadi', year: 2009 },
        { title: 'Bumi', author: 'Tere Liye', year: 2014 }
      ]);
      res.send('Dummy data berhasil ditambahkan!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Gagal menambahkan dummy data.');
    }
  });
  