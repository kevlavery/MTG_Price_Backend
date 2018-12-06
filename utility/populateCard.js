var requestPromise = require('request-promise-native');
var Card = require('../models/card');
var promiseLimit = require('promise-limit')
 
var limit = promiseLimit(10)

const getCard = async (cardID) => ***REMOVED***
    return requestPromise(***REMOVED***
        url: 'https://api.scryfall.com/cards/' + cardID,
        method: "GET",
        headers: ***REMOVED***
            "Content-Type": "application/json"
        ***REMOVED***    
    ***REMOVED***).then((cardData) => ***REMOVED***
        return JSON.parse(cardData);
    ***REMOVED***).catch((error) => console.log('error getting card with Scryfall ID ', cardID, error));   
***REMOVED***

exports.addCard = async (card) => ***REMOVED***
    cardImage = null;
    if (card.image_uris) ***REMOVED***
        cardImage = card.image_uris.normal;
    ***REMOVED***

    let newCard = ***REMOVED***
        scryfallId: card.id,
        name: card.name,
        price: [***REMOVED***value: card.usd***REMOVED***],
        cmc: card.cmc,
        scryfallLink: card.scryfall_uri
    ***REMOVED***;

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
        console.log("error: " + error);
    ***REMOVED***);
***REMOVED***

exports.getAndPopulateCard = async (cardID) => ***REMOVED***
    let cardData = await getCard(cardURI);
    await addCard(cardData);
***REMOVED***

exports.updateCardPrice = async (cards) => ***REMOVED***
    await Promise.all(cards.map(async (card) => ***REMOVED***
        return limit(async () => ***REMOVED***
            try ***REMOVED***
                let updatedCard = await getCard(card.scryfallId);
                await sleep(100);
                console.log(updatedCard.name, "added");
                await Card.updateOne(
                    ***REMOVED***scryfallId: card.scryfallId***REMOVED***,
                    ***REMOVED***$push: ***REMOVED***price: ***REMOVED***value: updatedCard.usd***REMOVED******REMOVED******REMOVED***
                )
                .catch((error) => ***REMOVED***
                    console.log("error: " + error);
                ***REMOVED***);
            ***REMOVED*** catch (error) ***REMOVED***
                console.log(error);
            ***REMOVED***
        ***REMOVED***)
    ***REMOVED***));
***REMOVED***

function sleep(ms) ***REMOVED***
    return new Promise(resolve => setTimeout(resolve, ms));
***REMOVED***