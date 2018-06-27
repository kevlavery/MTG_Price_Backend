var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sets = require('../models/sets');

/* GET home page. */
router.get('/:name', function(req, res, next) {
    var name = req.params.name;
    Sets.findOne({"name": name}).exec((err, set) => {
        res.status(200).send(set);
        if(err) {
            console.log(err);
        }
    });
});

module.exports = router;
