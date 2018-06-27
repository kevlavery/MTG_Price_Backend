var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sets = require('../models/sets');

/* GET home page. */
router.get('/:name', function(req, res, next) {
    var name = req.params.name;
    console.log(req.params);
    Sets.findOne({"name": name}).exec((err, set) => {
        res.status(200).send(set);
        console.log("result: "+set);
        console.log("error: "+err);
    });
});

module.exports = router;
