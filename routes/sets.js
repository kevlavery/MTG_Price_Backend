var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) ***REMOVED***
    var users = [];
    users.push(***REMOVED***
        firstName: "Kevin",
        lastName: "Lavery",
        username: "kevlavery",
        email: "email addy"
     ***REMOVED***);

    res.status(200).send(users);
***REMOVED***);

module.exports = router;
