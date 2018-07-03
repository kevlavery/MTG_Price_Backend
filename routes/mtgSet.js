var express = require('express');
var router = express.Router();
var setUtility = require('../utility/attachCardsToSet');
var Sets = require('../models/sets');

/* GET home page. */
router.get('/:name', (req, res, next) => {
    let name = req.params.name;
    Sets.findOne({"name": name}).exec(async (err, set) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        }

        if(set && set.cardIds.length == set.count) {
            res.status(200).send(set);
        } else {
            try {
                await setUtility.getAndPopulateSet(name);
                res.redirect(req.originalUrl);
            } catch (err) {
                res.status(500).send(err);
            }
        }
    });
});

module.exports = router;
