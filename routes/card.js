var express = require('express');
var router = express.Router();
var Card = require('../models/card');

/* GET home page. */
router.get('/:id', function(req, res, next) ***REMOVED***
    cardId = req.params.id;
    Card.findOne(***REMOVED***"productId": cardId***REMOVED***).exec((err, card) => ***REMOVED***
        res.status(200).send(card);
        if(err) ***REMOVED***
            console.log(err);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***);

module.exports = router;
