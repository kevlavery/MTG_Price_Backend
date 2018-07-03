var express = require('express');
var router = express.Router();
var Sets = require('../models/sets');

/* GET home page. */
router.get('/', function(req, res, next) {
    Sets.find().exec((err, sets) => {
        let setNames = sets.map(set => set.name); 
        res.status(200).send(setNames);
        if(err) {
            console.log(err);
        }
    });
});

module.exports = router;
