var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setsSchema = new Schema({
  name: String,
  count: Number,
  searchURI: String,
  cardIds: [String]
});

module.exports = mongoose.model('set', setsSchema);