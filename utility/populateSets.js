var request = require('request');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');
var AttachCards = require('./attachCardsToSet');

exports.getSets = async () => ***REMOVED***
    TCGAuthentication.getToken().then((token) => ***REMOVED*** 
        let bearer = token;
        const authorization = 'bearer ' + bearer;

        request(***REMOVED***
            url: "https://api.tcgplayer.com/catalog/categories/1/search/manifest", 
            method: "GET",
            headers: ***REMOVED***
                "Authorization": authorization,
                "Content-Type": "application/json",
                "Accept": "application/json"  
            ***REMOVED***
        ***REMOVED***, (error, response, body) => ***REMOVED***
            //get list of set names from response
            console.log('error getting list of cards:', error);
            result = JSON.parse(body).results[0].filters[2].items;

            result.forEach(async (set) => ***REMOVED***
                try ***REMOVED***
                    const setQuery = await Sets.findOne(***REMOVED***"name": set.text***REMOVED***).exec();
                    if(!setQuery) ***REMOVED***
                        let newSet = new Sets(***REMOVED***
                            name: set.text
                        ***REMOVED***);
                        newSet.save((err) => ***REMOVED***
                            if (err) console.log(err);
                        ***REMOVED***);
                    ***REMOVED***
                    AttachCards.populateSet(set.text);
                ***REMOVED*** catch (error) ***REMOVED***
                    console.log(error);
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***);   
***REMOVED***



  
