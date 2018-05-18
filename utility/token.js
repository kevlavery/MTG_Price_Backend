var restCredentials = require('../data/TCGConnectionData.json');
var request = require('request');
var token = require('../models/token')

const data = 'grant_type=client_credentials&client_id='
                + restCredentials.publicKey
                + '&client_secret='
                + restCredentials.privateKey;

exports.getToken = () => ***REMOVED***
    request(***REMOVED***
        url: "http://api.tcgplayer.com/token", //look to see if they support HTTPS
        method: "POST",
        headers: ***REMOVED***
            "content-type": "application/json",  
        ***REMOVED***,
        body: data
    ***REMOVED***, (error, response, body) => ***REMOVED***
        var token = JSON.parse(body);
        var currentToken = new token(***REMOVED***
            access_token: token.access_token,
            expires_in: token.expires_in,
            expiry_date: token['.expires']
        ***REMOVED***);
        
        currentToken.save((err) => ***REMOVED***
            if (err) console.log(err);
        ***REMOVED***);
        console.log(currentToken);
    ***REMOVED***);
***REMOVED***



  
