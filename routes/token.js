var restCredentials = require('../data/connectionData.json');
var request = require('request');

const data = 'grant_type=client_credentials&client_id='
                + restCredentials.publicKey
                + '&client_secret='
                + restCredentials.privateKey;
    
exports.getToken = () => ***REMOVED***
    request(***REMOVED***
        url: "http://api.tcgplayer.com/token", //look to see if they support HTTPS
        method: "POST",
        headers: ***REMOVED***
            "content-type": "application/json",  // <--Very important!!!
        ***REMOVED***,
        body: data
    ***REMOVED***, (error, response, body) => ***REMOVED***
        console.log(body)
    ***REMOVED***);
***REMOVED***



  
