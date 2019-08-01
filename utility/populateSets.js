var requestPromise = require('request-promise-native');
var Sets = require('../models/sets');

exports.getSets = async () => {
    return requestPromise({
        url: "https://api.scryfall.com/sets", 
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        //get list of set names from response
        return JSON.parse(response).data
        .filter(set => set.set_type !== "token");
    }).catch((error) => console.log('error getting list of cards: ', error)); 
}

exports.populateSets = async (setsResult) => {
    await Promise.all(setsResult.map(async (set) => {
        addSet: try {
            const setQuery = await Sets.findOne({"name": set.name}).exec();
            //don't add if a digital only set (only released on MTGO)
            if (set.digital) {
                console.log(`Digital set ${set.name} ignored`);
                break addSet;
            }

            //if set doesn't exist in db add it
            if (!setQuery) {
                let newSet = new Sets({
                    name: set.name,
                    count: set.card_count,
                    searchURI: set.search_uri
                });
                await newSet.save((err) => {
                    if (err) console.log(err);
                });
                await sleep(1);
                console.log(`${set.name} added`);
            //if new cards added to set, update
            } else if (setQuery.count != set.card_count) {
                console.log("updating ", set.name);
                let newSet = {
                    name: set.name,
                    count: set.card_count,
                    searchURI: set.search_uri
                };
                Sets.findOneAndUpdate(
                    {"name": set.name},
                    newSet,
                    {upsert: true}
                ).exec()
                .catch((error) => {console.log("error: "+error)});
            }
        } catch (error) {
            console.log(error);
        }
    }));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}