// models/borrow.js
const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  bookId: String,
  nim: String,
  nama: String,
  kelas: String,
  tanggalPinjam: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Borrow', borrowSchema);
