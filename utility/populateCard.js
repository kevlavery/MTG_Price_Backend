var Card = require('../models/card');

const getCard = async (cardID) => ***REMOVED***
    return requestPromise(***REMOVED***
        url: 'https://api.scryfall.com/cards/' + cardID,
        method: "GET",
        headers: ***REMOVED***
            "Content-Type": "application/json",
            "Accept": "application/json"
        ***REMOVED***    
    ***REMOVED***).then(cardData => ***REMOVED***
        return JSON.parse(cardData);
    ***REMOVED***).catch((error) => console.log('error getting card with Scryfall ID ', cardID, error));   
***REMOVED***

exports.addCard = async (card) => ***REMOVED***
    let newCard = ***REMOVED***
        scryfallId: card.id,
        name: card.name,
        imageURL: card.image_uris.normal,
        price: card.usd
    ***REMOVED***;
    //updates object or creates new if none found
    Card.findOneAndUpdate(
        ***REMOVED***scryfallId: card.id***REMOVED***,
        newCard,
        ***REMOVED***upsert: true***REMOVED***
    ).exec()
    .catch((error) => ***REMOVED***console.log("error: "+error)***REMOVED***);
***REMOVED***

exports.getAndPopulateCard = async (cardID) => ***REMOVED***
    let cardData = await getCard(cardURI);
    await addCard(cardData);
***REMOVED***;