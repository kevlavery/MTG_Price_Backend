var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema({
  name: String,
  imageURL: String,
  medPrice: Number
});

module.exports = mongoose.model('cards', cardSchema);