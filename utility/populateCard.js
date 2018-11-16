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
    // cardImage = null;
    // if (card.image_uris) {
    //     cardImage = card.image_uris.normal;
    // }

    let newCard = {
        scryfallId: card.id,
        name: card.name,
        price: card.usd,
        cmc: card.cmc,
        scryfallLink: scryfall_uri
    };

    //add oracle text and name 
    if (card.layout == "flip" || card.layout == "split" || card.layout == "transform") {
        newCard.faces.front.name = card.card_faces[0].name;
        newCard.oracle = card.card_faces[0].oracle_text;

        newCard.faces.back.name = card.card_faces[1].name;
        newCard.faces.back.oracle = card.card_faces[1].oracle_text;
    } else {
        newCard.oracle = card.oracle_text;
    }

    //add image or both if transform card
    if (card.layout == "transform") {
        newCard.imageURL = card.card_faces[0].image_uris.normal;
        newCard.faces.back.imageURL = card.card_faces[1].image_uris.normal;;
    } else {
        newCard.imageURL = card.image_uris.normal;
    }

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