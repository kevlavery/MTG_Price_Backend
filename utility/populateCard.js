var requestPromise = require('request-promise-native');
var TCGAuthentication = require('./token');
var Card = require('../models/card');

exports.addCard = async (cardId) => ***REMOVED***
    TCGAuthentication.getToken().then(async (token) => ***REMOVED*** 
        let bearer = token;
        const authorization = 'bearer ' + bearer;
        let cardQuery = await Promise.all([
            getCardDetail(authorization, cardId), 
            getCardPrice(authorization, cardId)
        ])
        const cardDetail = JSON.parse(cardQuery[0]);
        const cardPrice = JSON.parse(cardQuery[1]);       
        let newCard = ***REMOVED***
            productId: cardId,
            name: cardDetail.results[0].productName,
            imageURL: cardDetail.results[0].image,
            medPrice: cardPrice.results[0].midPrice,
            lowPrice: cardPrice.results[0].lowPrice,
            highPrice: cardPrice.results[0].highPrice
        ***REMOVED***;
        //updates object or creates new if none found
        searchedCard = Card.findOneAndUpdate(
            ***REMOVED***productId: cardId***REMOVED***,
            newCard,
            ***REMOVED***upsert: true***REMOVED***
        ).exec()
        .then((response) => ***REMOVED***console.log("response: "+response)***REMOVED***)
        .catch((error) => ***REMOVED***console.log("error: "+error)***REMOVED***);
            
    ***REMOVED***);   
***REMOVED***

const getCardPrice = async (authorization, cardId) => ***REMOVED***
    return requestPromise(***REMOVED***
        url: "http://api.tcgplayer.com/pricing/product/"+cardId,
        method: "GET",
        headers: ***REMOVED***
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"
        ***REMOVED***
    ***REMOVED***)
***REMOVED***

const getCardDetail = async (authorization, cardId) => ***REMOVED***
    return requestPromise(***REMOVED***
        url: "http://api.tcgplayer.com/catalog/products/"+cardId,
        method: "GET",
        headers: ***REMOVED***
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"
        ***REMOVED***
    ***REMOVED***)
***REMOVED***