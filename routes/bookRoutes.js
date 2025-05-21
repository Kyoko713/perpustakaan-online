const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');
const Borrow = require('../models/Borrow');

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Halaman form tambah buku (admin)
router.get('/tambah', (req, res) => {
  res.render('admin/form-tambah'); // ✅ arahin ke folder admin
});

// Menampilkan daftar buku (admin home)
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();  
    res.render('admin/index', { books }); // ✅ render index admin
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat mengambil daftar buku.");
  }
});

// Menambahkan buku baru
router.post('/tambah', upload.single('image'), async (req, res) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      year: req.body.year,
      synopsis: req.body.synopsis,
      available: true,
      imageUrl: '/uploads/' + req.file.filename
    });

    await newBook.save();
    res.redirect('/admin'); // ✅ kembali ke dashboard admin
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menambahkan buku');
  }
});

// Memproses peminjaman
router.post('/pinjam/:id', async (req, res) => {
  const { nim, nama, kelas } = req.body;
  const bookId = req.params.id;

  try {
    await Borrow.create({ bookId, nim, nama, kelas });
    await Book.findByIdAndUpdate(bookId, { available: false });
    res.redirect('/admin'); // ✅ redirect ke admin
  } catch (err) {
    console.error('Gagal meminjam buku:', err);
    res.status(500).send('Gagal meminjam buku');
  }
});

// Mengembalikan buku
router.post('/kembali/:id', async (req, res) => {
  try {
    const bookId = String(req.params.id);
    const updatedBook = await Book.findByIdAndUpdate(bookId, { available: true });

    if (!updatedBook) {
      return res.status(404).send('Buku tidak ditemukan');
    }

    const deletedBorrow = await Borrow.deleteOne({ bookId });

    res.redirect('/admin');
  } catch (err) {
    console.error('Gagal mengembalikan buku:', err);
    res.status(500).send('Gagal mengembalikan buku');
  }
});

// Halaman detail buku admin
router.get('/buku/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render('admin/detail', { book }); // ✅ arahkan ke views/admin/detail.ejs
  } catch (err) {
    res.status(500).send('Buku tidak ditemukan');
  }
});

module.exports = router;
