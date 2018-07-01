var requestPromise = require('request-promise-native');
var TCGAuthentication = require('./token');
var Card = require('../models/card');

exports.addCard = async (cardId) => {
    TCGAuthentication.getToken().then(async (token) => { 
        let bearer = token;
        const authorization = 'bearer ' + bearer;
        let cardQuery = await Promise.all([
            getCardDetail(authorization, cardId), 
            getCardPrice(authorization, cardId)
        ])
        const cardDetail = JSON.parse(cardQuery[0]);
        const cardPrice = JSON.parse(cardQuery[1]);       
        let newCard = {
            productId: cardId,
            name: cardDetail.results[0].productName,
            imageURL: cardDetail.results[0].image,
            medPrice: cardPrice.results[0].midPrice,
            lowPrice: cardPrice.results[0].lowPrice,
            highPrice: cardPrice.results[0].highPrice
        };
        //updates object or creates new if none found
        searchedCard = Card.findOneAndUpdate(
            {productId: cardId},
            newCard,
            {upsert: true}
        ).exec()
        .catch((error) => {console.log("error: "+error)});
            
    });   
}

const getCardPrice = async (authorization, cardId) => {
    return requestPromise({
        url: "http://api.tcgplayer.com/pricing/product/"+cardId,
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
}

const getCardDetail = async (authorization, cardId) => {
    return requestPromise({
        url: "http://api.tcgplayer.com/catalog/products/"+cardId,
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
}