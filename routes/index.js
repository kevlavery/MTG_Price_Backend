var express = require('express');
var router = express.Router();
var getToken = require('../utility/token');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
