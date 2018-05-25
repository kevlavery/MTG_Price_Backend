var request = require('request');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');

exports.getSets = async () => ***REMOVED***
    TCGAuthentication.getToken().then((token) => ***REMOVED*** 
        let bearer = token;
        const authorization = 'bearer ' + bearer;

        try ***REMOVED***
            let setQuery = await Sets.find(***REMOVED******REMOVED***).exec();
        ***REMOVED*** catch (error) ***REMOVED***
            console.log(error);
        ***REMOVED***  
        
        return request(***REMOVED***
            url: "http://api.tcgplayer.com/catalog/categories/1/search",
            method: "POST",
            headers: ***REMOVED***
                "Authorization": authorization,
                "Content-Type": "application/json",
                "Accept": "application/json"
            ***REMOVED***,
            body: data
        ***REMOVED***, (error, response, body) => ***REMOVED***
    ***REMOVED***);   
***REMOVED***



  
