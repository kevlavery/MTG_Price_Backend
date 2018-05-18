var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tokenSchema = new Schema(***REMOVED***
  access_token: String,
  expires_in: Number,
  expiry_date: Date
***REMOVED***);

module.exports = mongoose.model('restcredentials', tokenSchema);