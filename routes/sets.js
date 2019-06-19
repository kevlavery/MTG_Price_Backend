var express = require('express');
var router = express.Router();
var Sets = require('../models/sets');
var Card = require('../models/card');
var attachCards = require('../utility/attachCardsToSet');

router.get('/', (req, res, next) => {
    Sets.find().exec((err, sets) => {
        let setNames = sets.map(set => set.name); 
        res.status(200).send(setNames);
        if(err) {
            console.log(err);
        }
    });
});

// router.get('/:name', (req, res, next) => {
//     let name = req.params.name;
//     Sets.findOne({"name": name}).exec(async (err, set) => {
//         if(err) {
//             console.log(err);
//             res.status(500).send(err);
//         }

//         if(set && set.cardIds.length == set.count) {
//             res.status(200).send(set);
//         } else {
//             try {
//                 await attachCards.getAndPopulateSet(set.searchURI, name);
//                 res.redirect(req.originalUrl);
//             } catch (err) {
//                 console.log(err);
//                 res.status(500).send(err);
//             }
//         }
//     });
// });

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