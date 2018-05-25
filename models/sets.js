var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setsSchema = new Schema({
  name: String,
  count: Number,
  cardIds: [Number]
});

module.exports = mongoose.model('set', setsSchema);