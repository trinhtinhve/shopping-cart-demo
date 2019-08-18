const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: String,
  description: String,
  price: Number
}, {
  versionKey: false
});

module.exports = mongoose.model('product', productSchema);
