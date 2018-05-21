var restCredentials = require('../data/TCGConnectionData.json');
var request = require('request');
var Token = require('../models/token')

const data = 'grant_type=client_credentials&client_id='
                + restCredentials.publicKey
                + '&client_secret='
                + restCredentials.privateKey;

exports.getToken = async() => ***REMOVED***
    let token = "empty";
    let tokenQuery = Token.findOne();
    tokenQuery.select("access_token expiry_date");
    tokenQuery.exec((err, dbToken) => ***REMOVED***
        if (err) console.log(err);

        //console.log(dbToken.access_token);
        var expiry_date = new Date(dbToken.expiry_date);
        if(expiry_date >= Date.now()) ***REMOVED***
            token = getRESTToken();
            //console.log(token)
        ***REMOVED*** else ***REMOVED***
            token = dbToken.access_token.toString();
            //console.log(dbToken.access_token)
        ***REMOVED***
        return token;
    ***REMOVED***);
    return token;
***REMOVED***

getRESTToken = () => ***REMOVED***
    request(***REMOVED***
        url: "http://api.tcgplayer.com/token", //look to see if they support HTTPS
        method: "POST",
        headers: ***REMOVED***
            "content-type": "application/json"  
        ***REMOVED***,
        body: data
    ***REMOVED***, (error, response, body) => ***REMOVED***
        let token = JSON.parse(body);
        let currentToken = new Token(***REMOVED***
            access_token: token.access_token,
            expiry_date: token['.expires']
        ***REMOVED***);
        
        currentToken.save((err) => ***REMOVED***
            if (err) console.log(err);
        ***REMOVED***);
        return token.access_token;
    ***REMOVED***);
***REMOVED***



  
