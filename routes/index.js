var express = require('express');
var router = express.Router();
var getToken = require('./token');

/* GET home page. */
router.get('/', function(req, res, next) ***REMOVED***
  res.render('index', ***REMOVED*** title: 'Express' ***REMOVED***);
***REMOVED***);

module.exports = router;
