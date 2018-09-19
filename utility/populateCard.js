var Card = require('../models/card');

const getCard = async (cardID) => {
    return requestPromise({
        url: 'https://api.scryfall.com/cards/' + cardID,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }    
    }).then(cardData => {
        return JSON.parse(cardData);
    }).catch((error) => console.log('error getting card with Scryfall ID ', cardID, error));   
}

exports.addCard = async (card) => {
    let newCard = {
        scryfallId: card.id,
        name: card.name,
        imageURL: card.image_uris.normal,
        price: card.usd
    };
    //updates object or creates new if none found
    Card.findOneAndUpdate(
        {scryfallId: card.id},
        newCard,
        {upsert: true}
    ).exec()
    .catch((error) => {console.log("error: "+error)});
}

exports.getAndPopulateCard = async (cardID) => {
    let cardData = await getCard(cardURI);
    await addCard(cardData);
};