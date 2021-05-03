const request = require('request');
const requestPromise = require('request-promise-native');
const JSONStream = require('JSONStream');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const databaseConnection = require('../data/DatabaseConnection.json');
const ***REMOVED*** Transform ***REMOVED*** = require('stream');

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
***REMOVED***

const transformCard = new Transform(***REMOVED***
    objectMode: true,
    transform(card, encoding, callback) ***REMOVED***
        if(card.lang === "en" 
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

            //push card object to next stream
            this.push(newCard);
        ***REMOVED***
        callback();
    ***REMOVED***
***REMOVED***);

exports.getAndPopulateBulkData = async () => ***REMOVED***
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
                .pipe(transformCard)
                .pipe(dbWriteStream);

    ***REMOVED*** catch (error) ***REMOVED***
        console.log(error);
    ***REMOVED***
***REMOVED***