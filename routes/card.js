var express = require('express');
var router = express.Router();
var Card = require('../models/card');

/* GET home page. */
router.get('/:id', function(req, res, next) {
    cardId = req.params.id;
    Card.findOne({"productId": cardId}).exec((err, card) => {
        res.status(200).send(card);
        if(err) {
            console.log(err);
        }
    });
});

module.exports = router;
