var request = require('request');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');

exports.getCard = async (cardId) => ***REMOVED***
    TCGAuthentication.getToken().then(async (token) => ***REMOVED*** 
        console.log("populate card token:", token)
        let bearer = token;
        const authorization = 'bearer ' + bearer;
        let test = await Promise.all([
            getCardDetail(authorization, cardId), 
            getCardPrice(authorization, cardId)
        ])
        //console.log(test)
    ***REMOVED***);   
***REMOVED***

const getCardPrice = async (authorization, cardId) => ***REMOVED***
    return request(***REMOVED***
        url: "http://api.tcgplayer.com/pricing/product/"+cardId,
        method: "GET",
        headers: ***REMOVED***
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"
        ***REMOVED***
    ***REMOVED***, (error, response, body) => ***REMOVED***
        console.log('error getting card price:', error);
        const result = JSON.parse(body);

    ***REMOVED***)
***REMOVED***

const getCardDetail = async (authorization, cardId) => ***REMOVED***
    return request(***REMOVED***
        url: "http://api.tcgplayer.com/catalog/products/"+cardId,
        method: "GET",
        headers: ***REMOVED***
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"
        ***REMOVED***
    ***REMOVED***, (error, response, body) => ***REMOVED***
        console.log('error getting card details:', error);
        const result = JSON.parse(body);
    ***REMOVED***)
***REMOVED***