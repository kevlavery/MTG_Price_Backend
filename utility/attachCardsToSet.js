var requestPromise = require('request-promise-native');
var Sets = require('../models/sets');

exports.getSet = async (setURI) => {
    return requestPromise({
        url: setURI,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }    
    }).then(setQuery => {
        return JSON.parse(setQuery);
    }).catch((error) => console.log('error getting set ', setURI, error));   
}

exports.populateSetCards = async (cardsResult, setName) => {
    if(cardsResult) {
        const cards = cardsResult.results;
        const totalItems = cardsResult.totalItems; 

        try {
            const setQuery = await Sets.findOne({name : setName}).exec();
            if (!setQuery.count || setQuery.count < totalItems) {
                setQuery.set({cardIds: cards,
                                count: totalItems});
                setQuery.save((err) => {
                    if (err) console.log(err);
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}

exports.getAndPopulateSet = async (setName) => {
    let token = await TCGAuthentication.getToken();
    let result = await this.getSet(setName, token);
    this.populateSetCards(result, setName);
};