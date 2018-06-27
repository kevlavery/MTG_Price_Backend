var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sets = require('../models/sets');

/* GET home page. */
router.get('/:name', function(req, res, next) ***REMOVED***
    var name = req.params.name;
    console.log(req.params);
    Sets.findOne(***REMOVED***"name": name***REMOVED***).exec((err, set) => ***REMOVED***
        res.status(200).send(set);
        console.log("result: "+set);
        console.log("error: "+err);
    ***REMOVED***);
***REMOVED***);

module.exports = router;
