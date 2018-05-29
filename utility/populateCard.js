var request = require('request');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');

exports.getCard = async (cardId) => {
    TCGAuthentication.getToken().then(async (token) => { 
        console.log("populate card token:", token)
        let bearer = token;
        const authorization = 'bearer ' + bearer;
        let test = await Promise.all([
            getCardDetail(authorization, cardId), 
            getCardPrice(authorization, cardId)
        ])
        //console.log(test)
    });   
}

const getCardPrice = async (authorization, cardId) => {
    return request({
        url: "http://api.tcgplayer.com/pricing/product/"+cardId,
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }, (error, response, body) => {
        console.log('error getting card price:', error);
        const result = JSON.parse(body);

    })
}

const getCardDetail = async (authorization, cardId) => {
    return request({
        url: "http://api.tcgplayer.com/catalog/products/"+cardId,
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }, (error, response, body) => {
        console.log('error getting card details:', error);
        const result = JSON.parse(body);
    })
}