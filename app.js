const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// Setup body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Setup view engine
app.set('view engine', 'ejs');

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/perpustakaan', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Koneksi MongoDB berhasil'))
.catch(err => console.log('Error koneksi MongoDB:', err));

// Gunakan routes untuk buku
app.use('/', bookRoutes);

// Jalankan server
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
