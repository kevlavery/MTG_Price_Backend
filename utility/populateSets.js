var request = require('request');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');
var AttachCards = require('./attachCardsToSet');

exports.getSets = async () => {
    TCGAuthentication.getToken().then((token) => { 
        let bearer = token;
        const authorization = 'bearer ' + bearer;

        request({
            url: "https://api.tcgplayer.com/catalog/categories/1/search/manifest", 
            method: "GET",
            headers: {
                "Authorization": authorization,
                "Content-Type": "application/json",
                "Accept": "application/json"  
            }
        }, (error, response, body) => {
            //get list of set names from response
            if(error) console.log('error getting list of cards:', error);

            result = JSON.parse(body).results[0].filters[2].items;

            result.forEach(async (set) => {
                try {
                    const setQuery = await Sets.findOne({"name": set.text}).exec();
                    //if set doesn't exist in db add it
                    if(!setQuery) {
                        let newSet = new Sets({
                            name: set.text
                        });
                        newSet.save((err) => {
                            if (err) console.log(err);
                        });
                    }
                    AttachCards.populateSet(set.text);
                } catch (error) {
                    console.log(error);
                }
            });
        });
    });   
}



  
