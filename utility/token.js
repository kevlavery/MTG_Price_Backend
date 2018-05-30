var restCredentials = require('../data/TCGConnectionData.json');
var requestPromise = require('request-promise-native');
var Token = require('../models/token');

const data = 'grant_type=client_credentials&client_id='
                + restCredentials.publicKey
                + '&client_secret='
                + restCredentials.privateKey;

exports.getToken = async () => ***REMOVED***
    try ***REMOVED***
        let tokenQuery = await Token.findOne(***REMOVED******REMOVED***).exec();
        if(!tokenQuery || new Date(tokenQuery.expiry_date) <= Date.now()) ***REMOVED***
            tokenQuery = await getRESTToken();
        ***REMOVED***
        return tokenQuery.access_token;
    ***REMOVED*** catch (error) ***REMOVED***
        console.log(error);
    ***REMOVED***
***REMOVED***

const getRESTToken = () => ***REMOVED***
   return rPromise(***REMOVED***
        url: "http://api.tcgplayer.com/token", //look to see if they support HTTPS
        method: "POST",
        headers: ***REMOVED***
            "Content-Type": "application/json"  
        ***REMOVED***,
        body: data
    ***REMOVED***).then((tokenQuery) => ***REMOVED***
        let token = JSON.parse(tokenQuery);
        let currentToken = new Token(***REMOVED***
            access_token: token.access_token,
            expiry_date: token['.expires']
        ***REMOVED***);
        currentToken.save((err) => ***REMOVED***
            if (err) console.log(err);
        ***REMOVED***);
        return token;
    ***REMOVED***);
    
***REMOVED***



  
