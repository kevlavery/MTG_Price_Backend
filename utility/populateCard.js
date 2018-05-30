var requestPromise = require('request-promise-native');
var TCGAuthentication = require('./token');
var Card = require('../models/card');

exports.getCard = async (cardId) => {
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
            medPrice: cardPrice.results[1].midPrice
        };
        searchedCard = Card.findOneAndUpdate(
            {productId: cardId},
            newCard,
            {upsert: true}
        ).exec()
        .then((response) => {console.log("response: "+response)})
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