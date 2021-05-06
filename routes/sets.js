var express = require('express');
var router = express.Router();
var Card = require('../models/card');

router.get('/', (req, res, next) => {
    Card.distinct("set").exec((err, sets) => {
        if(err) {
            console.log(err);
            res.status(500).send("Database Error");
        } else {
            res.status(200).send(sets.sort());
        }
    })
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