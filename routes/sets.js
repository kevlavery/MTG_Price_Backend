var express = require('express');
var router = express.Router();
var Sets = require('../models/sets');
var Card = require('../models/card');

router.get('/', (req, res, next) => {
    Sets.find().exec((err, sets) => {
        let setNames = sets.map(set => set.name); 
        res.status(200).send(setNames);
        if(err) {
            console.log(err);
        }
    });
});

router.get('/:name', (req, res, next) => {
    let name = req.params.name;
    Card.find({"set": name}).exec(async (err, set) => {
        if(err) {
            console.log(err);
            res.status(500).send(er);
        }
        res.status(200).send(set);
    });
});

module.exports = router;