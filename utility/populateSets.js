var request = require('request');
var token = require('./token');

exports.getSets = () => ***REMOVED***
    var token = 

    request(***REMOVED***
        url: "https://api.tcgplayer.com/catalog/categories/1/search/manifest", 
        method: "GET",
        headers: ***REMOVED***
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"  
        ***REMOVED***,
        body: data
    ***REMOVED***, (error, response, body) => ***REMOVED***
        var token = JSON.parse(body);
        var currentToken = new token(***REMOVED***
            access_token: token.access_token,
            expiry_date: token['.expires']
        ***REMOVED***);
        
        currentToken.save((err) => ***REMOVED***
            if (err) console.log(err);
        ***REMOVED***);
        console.log(currentToken);
    ***REMOVED***);
***REMOVED***



  
