const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');

//untuk menjalan kan admin web
app.use('/admin', bookRoutes); // untuk admin


//unuk menjalan kan costomer web
const customerRoutes = require('./routes/customerRoutes');
app.use('/', customerRoutes); // untuk user


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Setup body parser untuk parsing data dari form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Untuk parsing data JSON jika diperlukan
app.use('/uploads', express.static('uploads'));

// Setup multer untuk handle upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Lokasi penyimpanan gambar
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  }
});
const upload = multer({ storage: storage });

// Setup view engine
app.set('view engine', 'ejs');

// Folder views
app.set('views', path.join(__dirname, 'views'));

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/perpustakaan', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Koneksi MongoDB berhasil'))
  .catch(err => console.log('Error koneksi MongoDB:', err));

// Gunakan routes untuk buku
app.use('/', bookRoutes);

// Middleware untuk file upload (misalnya upload gambar buku)
app.post('/tambah', upload.single('image'), (req, res) => {
  const { title, author, year, synopsis } = req.body; // Mendapatkan data buku dari body
  const imageUrl = req.file ? '/uploads/' + req.file.filename : null; // Mendapatkan URL gambar

  if (!title || !author || !year || !synopsis) {
    return res.status(400).send('Semua data wajib diisi');
  }

  // Simpan data buku ke database (gunakan model sesuai database)
  // Contoh menggunakan mongoose:
  // const Book = mongoose.model('Book', bookSchema); 
  // Book.create({ title, author, year, synopsis, imageUrl })
  //   .then(() => res.redirect('/'))
  //   .catch(err => res.status(500).send(err));

  // Untuk sekarang kita hanya mengirimkan response sebagai debug
  res.send({ title, author, year, synopsis, imageUrl });
});

// Jalankan server
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
