var requestPromise = require('request-promise-native');
var Card = require('../models/card');
var promiseLimit = require('promise-limit')
 
var limit = promiseLimit(20)

const getCard = async (cardID) => ***REMOVED***
    return requestPromise(***REMOVED***
        url: 'https://api.scryfall.com/cards/' + cardID,
        method: "GET",
        headers: ***REMOVED***
            "Content-Type": "application/json"
        ***REMOVED***    
    ***REMOVED***).then((cardData) => ***REMOVED***
        return JSON.parse(cardData);
    ***REMOVED***).catch((error) => console.log('error getting card with Scryfall ID', cardID));   
***REMOVED***

exports.addCard = async (card) => ***REMOVED***
    cardImage = null;
    if (card.image_uris) ***REMOVED***
        cardImage = card.image_uris.normal;
    ***REMOVED***

    let newCard = ***REMOVED***
        scryfallId: card.id,
        name: card.name,
        cmc: card.cmc,
        scryfallLink: card.scryfall_uri,
        set: card.set_name
    ***REMOVED***;

    if (card.prices.usd !== null) ***REMOVED***
        newCard.price = [***REMOVED***value: card.prices.usd***REMOVED***];
    ***REMOVED*** else if (card.prices.usd !== null) ***REMOVED***
        newCard.price = [***REMOVED***value: card.prices.usd_foil***REMOVED***];
    ***REMOVED***

    //add oracle text and name 
    if (card.layout == "flip" || card.layout == "split" || card.layout == "transform" || card.layout == "double_faced_token") ***REMOVED***
        faces = ***REMOVED***
            front: ***REMOVED***
                name: card.card_faces[0].name
            ***REMOVED***,
            back: ***REMOVED***
                name: card.card_faces[1].name,
                oracle: card.card_faces[1].oracle_text
            ***REMOVED***
        ***REMOVED***
        
        newCard.oracle = card.card_faces[0].oracle_text;
        newCard.faces = faces;
    ***REMOVED*** else ***REMOVED***
        newCard.oracle = card.oracle_text;
    ***REMOVED***

    //add image or both if transform card
    if (card.layout == "transform" || card.layout == "double_faced_token") ***REMOVED***
        newCard.imageURL = card.card_faces[0].image_uris.normal;
        newCard.faces.back.imageURL = card.card_faces[1].image_uris.normal;;
    ***REMOVED*** else ***REMOVED***
        newCard.imageURL = card.image_uris.normal;
    ***REMOVED***

    //updates object or creates new if none found
    Card.findOneAndUpdate(
        ***REMOVED***scryfallId: card.id***REMOVED***,
        newCard,
        ***REMOVED***upsert: true***REMOVED***
    ).exec()
    .catch((error) => ***REMOVED***
        console.log("error: " + error + " with scryfall ID" + newCard.scryfallId);
    ***REMOVED***);
***REMOVED***

exports.getAndPopulateCard = async (cardID) => ***REMOVED***
    let cardData = await getCard(cardURI);
    await addCard(cardData);
***REMOVED***

exports.updateCardPrice = async (cards) => ***REMOVED***
    //break down to 100 card batches to reduce memory loads
    let chunkSize = 100;
    let subGroups = []
    let groupSize = Math.ceil(cards.length/chunkSize)
    for(var i = 0; i < groupSize; i++)***REMOVED***
        subGroups.push(cards.splice(0, chunkSize))
    ***REMOVED***
    count = 0;

    await asyncForEach(subGroups, async (cardGroup) => ***REMOVED***
        Promise.all(cardGroup.map(async (card) => ***REMOVED***
            return limit(async () => ***REMOVED***
                try ***REMOVED***
                    let updatedCard = await getCard(card.scryfallId);
                    if (updatedCard) ***REMOVED***
                        let newPrice = null;
                        if (updatedCard.prices.usd !== null) ***REMOVED***
                            newPrice = updatedCard.prices.usd;
                        ***REMOVED*** else ***REMOVED***
                            newPrice = updatedCard.prices.usd_foil;
                        ***REMOVED***

                        await Card.updateOne(
                            ***REMOVED***scryfallId: card.scryfallId***REMOVED***,
                            ***REMOVED***$push: ***REMOVED***price: ***REMOVED***value: newPrice***REMOVED******REMOVED******REMOVED***
                        )
                        .catch((error) => ***REMOVED***
                            console.log("error updating db" + error);
                        ***REMOVED***);
                    ***REMOVED***
                ***REMOVED*** catch (error) ***REMOVED***
                    console.log(error);
                ***REMOVED***
            ***REMOVED***)
        ***REMOVED***));
        count++;
        console.log("group " + count + " done");
    ***REMOVED***);
***REMOVED***

async function asyncForEach(array, callback) ***REMOVED***
    for (let index = 0; index < array.length; index++) ***REMOVED***
        await callback(array[index], index, array);
    ***REMOVED***
***REMOVED***