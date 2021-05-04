const request = require('request');
const requestPromise = require('request-promise-native');
const JSONStream = require('JSONStream');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const databaseConnection = require('../data/DatabaseConnection.json');
const ***REMOVED*** Transform ***REMOVED*** = require('stream');
const Card = require('../models/card');


const scryfallBulkEndpoints = "https://api.scryfall.com/bulk-data";
const bulkDataName = "Default Cards"

const outputDBConfig = ***REMOVED*** dbURL : databaseConnection.url, 
    collection : 'cards',
    batchSize : 100 ***REMOVED***;
const dbWriteStream = streamToMongoDB(outputDBConfig);


const getBulkDataEndpoints = async () => ***REMOVED***
    return requestPromise(***REMOVED***
        url: scryfallBulkEndpoints,
        method: "GET",
        headers: ***REMOVED***
            "Content-Type": "application/json"
        ***REMOVED***    
    ***REMOVED***).then((endpointData) => ***REMOVED***
        return JSON.parse(endpointData);
    ***REMOVED***).catch((error) => console.log('error getting bulk upload endpoint data'));
***REMOVED***;

const transformCard = new Transform(***REMOVED***
    objectMode: true,
    transform(card, encoding, callback) ***REMOVED***
        if(card.lang === "en" 
            && !card.digital 
            && card.set_type !== "token" 
            && card.set_type !== "memorabilia"
        ) ***REMOVED***
            let newCard = populateNewCard(card);
            this.push(newCard); //push card object to next stream
        ***REMOVED***
        callback();
    ***REMOVED***
***REMOVED***);

const createNewCard = new Transform(***REMOVED***
    objectMode: true,
    async transform(card, encoding, callback) ***REMOVED***
        if ((await Card.exists(***REMOVED***scryfallId : card.id ***REMOVED***)) === false) ***REMOVED***
            let newCard = populateNewCard(card);
            this.push(newCard);
        ***REMOVED***
        // Card.exists(***REMOVED***scryfallId : card.id***REMOVED***, (err, doc) => ***REMOVED***
        //     if (err) ***REMOVED***
        //         console.log(`Error checking if $***REMOVED***card.name***REMOVED*** exists in DB`);
        //     ***REMOVED*** else ***REMOVED***
        //         if (!doc) ***REMOVED***
        //             let newCard = populateNewCard(card);
        //             this.push(newCard);
        //         ***REMOVED***
        //     ***REMOVED***
        // ***REMOVED***);
        callback();
    ***REMOVED***
***REMOVED***);

exports.populateNewCard = (card) => ***REMOVED***
    let newCard = ***REMOVED***
        scryfallId: card.id,
        name: card.name,
        cmc: card.cmc,
        scryfallLink: card.scryfall_uri,
        set: card.set_name
    ***REMOVED***;

    //add price data
    if (card.prices.usd !== null) ***REMOVED***
        newCard.price = [***REMOVED***value: card.prices.usd***REMOVED***];
    ***REMOVED*** else ***REMOVED***
        newCard.price = [***REMOVED***value: card.prices.usd_foil***REMOVED***];
    ***REMOVED***

    //add oracle text and name 
    if (card.layout == "flip" 
        || card.layout == "split" 
        || card.layout == "transform" 
        || card.layout == "double_faced_token") ***REMOVED***
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
    try ***REMOVED***
        if (card.layout == "transform" || card.layout == "double_faced_token") ***REMOVED***
            newCard.imageURL = card.card_faces[0].image_uris.normal;
            newCard.faces.back.imageURL = card.card_faces[1].image_uris.normal;
        ***REMOVED*** else ***REMOVED***
            newCard.imageURL = card.image_uris.normal;
        ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
        console.log(card)
    ***REMOVED***

    return newCard;
***REMOVED***;

exports.getAndPopulateBulkData = async () => ***REMOVED***
    try ***REMOVED***
        let endPointData = await getBulkDataEndpoints();
        let defaultCardsURL = endPointData.data
                            .filter(endpoint => endpoint.name === bulkDataName)[0]
                            .download_uri;
        request.get(defaultCardsURL)
                .pipe(JSONStream.parse('*'))
                .pipe(transformCard)
                .pipe(dbWriteStream);

    ***REMOVED*** catch (error) ***REMOVED***
        console.log(error);
    ***REMOVED***
***REMOVED***

exports.addNewReleasedCards = async () => ***REMOVED***
    try ***REMOVED***
        let endPointData = await getBulkDataEndpoints();
        let defaultCardsURL = endPointData.data
                            .filter(endpoint => endpoint.name === bulkDataName)[0]
                            .download_uri;
        request.get(defaultCardsURL)
                .pipe(JSONStream.parse('*'))
                .on('data', function(card) ***REMOVED***
                    console.log(card.name);
                ***REMOVED***)
                .pipe(createNewCard(item, Card))
                .pipe(dbWriteStream);
    ***REMOVED*** catch (error) ***REMOVED***
        console.log(error);
    ***REMOVED***
***REMOVED***