var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setsSchema = new Schema(***REMOVED***
  name: String,
  count: Number,
  cardIds: [Number]
***REMOVED***);

module.exports = mongoose.model('set', setsSchema);