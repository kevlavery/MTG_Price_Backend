const request = require('request');
const requestPromise = require('request-promise-native');
const JSONStream = require('JSONStream');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const fs = require('fs');
const ***REMOVED*** Transform ***REMOVED*** = require('stream');
const databaseConnection = require('../data/DatabaseConnection.json');
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
        let newCard = exports.populateNewCard(card);
        if(typeof newCard !== "undefined") ***REMOVED***
            this.push(newCard); //push card object to next stream
        ***REMOVED***
        callback();
    ***REMOVED***
***REMOVED***);

const populateNewCard = (card) => ***REMOVED***
    if (card.lang === "en" 
        && !card.digital 
        && card.set_type !== "token" 
        && card.set_type !== "memorabilia"
    ) ***REMOVED***
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
            || card.layout == "double_faced_token"
            || card.layout == "modal_dfc") ***REMOVED***
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
            if (card.layout == "transform" 
                || card.layout == "double_faced_token"
                || card.layout == "modal_dfc") ***REMOVED***
                newCard.imageURL = card.card_faces[0].image_uris.normal;
                newCard.faces.back.imageURL = card.card_faces[1].image_uris.normal;
            ***REMOVED*** else ***REMOVED***
                newCard.imageURL = card.image_uris.normal;
            ***REMOVED***
        ***REMOVED*** catch (error) ***REMOVED***
            console.log(`ERROR: $***REMOVED***error***REMOVED***`);
            console.log(card.name);
            console.log(card.scryfall_uri);
        ***REMOVED***

        return newCard;
    ***REMOVED***
***REMOVED***;

const getAndPopulateBulkData = async () => ***REMOVED***
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
***REMOVED***;

const addNewCards = async () => ***REMOVED***
    try ***REMOVED***
        let endPointData = await getBulkDataEndpoints();
        let defaultCardsURL = endPointData.data
                            .filter(endpoint => endpoint.name === bulkDataName)[0]
                            .download_uri;
        let bulkData = await requestPromise(***REMOVED***
            url: defaultCardsURL,
            method: "GET",
            headers: ***REMOVED***
                "Content-Type": "application/json"
            ***REMOVED***    
        ***REMOVED***).then((endpointData) => ***REMOVED***
            return JSON.parse(endpointData);
        ***REMOVED***).catch((error) => console.log('error getting bulk data'));
        console.log(`$***REMOVED***bulkData.length***REMOVED*** cards downloaded from scryfall bulk json`);

        let dbContents = await Card.find().lean();
        console.log(`$***REMOVED***dbContents.length***REMOVED*** cards found in DB`);

        let mtgFinObjs = bulkData.filter(
            (***REMOVED*** id ***REMOVED***) => !dbContents.some(dbItem => id === dbItem.scryfallId)
        ).filter(card => ***REMOVED***
            return  typeof card !== "undefined"
                    && card.lang === "en" 
                    && !card.digital 
                    && card.set_type !== "token" 
                    && card.set_type !== "memorabilia"
        ***REMOVED***).map(card => ***REMOVED***
            return exports.populateNewCard(card);
        ***REMOVED***);
        console.log(`$***REMOVED***mtgFinObjs.length***REMOVED*** cards after 2nd filter`);

        let chunkSize = 100;
        cardGroups = [];
        for (let i = 0; i < mtgFinObjs.length; i+=chunkSize) ***REMOVED***
            cardGroups.push(mtgFinObjs.slice(i, i+chunkSize));
        ***REMOVED***
        let count = 0;
        console.log(`$***REMOVED***cardGroups.length***REMOVED*** DB write groups made`);
        for (const cardGroup of cardGroups) ***REMOVED***
            count++;
            console.log(`adding group $***REMOVED***count***REMOVED***`)
            await Card.insertMany(cardGroup);
        ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
        console.log(error);
    ***REMOVED***
***REMOVED***;

exports.addNewCards = addNewCards;
exports.populateNewCard = populateNewCard;
exports.getAndPopulateBulkData = getAndPopulateBulkData;