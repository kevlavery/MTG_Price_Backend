var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setsSchema = new Schema(***REMOVED***
  access_token: String,
  expiry_date: Date
***REMOVED***);

module.exports = mongoose.model('sets_list', tokenSchema);