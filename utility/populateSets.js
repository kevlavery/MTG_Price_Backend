var request = require('request');
var TCGAuthentication = require('./token');

exports.getSets = () => ***REMOVED***
    TCGAuthentication.getToken().then((token) => ***REMOVED*** 
        let bearer = token;
        
        const authorization = 'bearer ' + bearer;

        console.log(authorization);

        request(***REMOVED***
            url: "https://api.tcgplayer.com/catalog/categories/1/search/manifest", 
            method: "GET",
            headers: ***REMOVED***
                "Authorization": authorization,
                "Content-Type": "application/json",
                "Accept": "application/json"  
            ***REMOVED***
        ***REMOVED***, (error, response, body) => ***REMOVED***
            result = JSON.parse(body);
            console.log(result.results[0].filters[2].items);
        ***REMOVED***);
    ***REMOVED***);
    
***REMOVED***



  
