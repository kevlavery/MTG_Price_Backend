const requestPromise = require('request-promise-native');
const populateCard = require('./populateCard');
const request = require('request');
const JSONStream = require('JSONStream');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const databaseConnection = require('../data/DatabaseConnection.json');
const ***REMOVED*** Transform ***REMOVED*** = require('stream');


const getBulkData = async () => ***REMOVED***
    return requestPromise(***REMOVED***
        url: "https://archive.scryfall.com/json/scryfall-all-cards.json",
        method: "GET",
        headers: ***REMOVED***
            "Content-Type": "application/json",
            "Accept": "application/json"
        ***REMOVED***    
    ***REMOVED***).then(bulkContents => ***REMOVED***
        return JSON.parse(bulkContents);
    ***REMOVED***).catch((error) => console.log('error retrieving bulk data'));   
***REMOVED***

const populateDB = async (bulkData) => ***REMOVED***
    if (bulkData) ***REMOVED***
        console.log(typeof bulkData)
        try ***REMOVED***
            await Promise.all(bulkData.map(async (card) => ***REMOVED***
                //add card to cards collection
                let setQuery = await Sets.findOne(***REMOVED***name : card.set_name***REMOVED***).exec();
                if (setQuery) ***REMOVED***
                    await populateCard.addCard(card)
                    .catch((error) => ***REMOVED***
                        console.log(card.id + " not added to cards DB");
                        console.log(error);
                    ***REMOVED***);
                    //add card scryfall ID to related set collection
                    await setQuery.updateOne(***REMOVED***$addToSet: ***REMOVED***cardIds: card.id***REMOVED******REMOVED***)
                    .catch((error) => ***REMOVED***
                        console.log(card.id + " not added to sets DB");
                        console.log(error);
                    ***REMOVED***);
                    await setQuery.save((err) => ***REMOVED***
                        if (err) console.log(err);
                    ***REMOVED***);
                ***REMOVED*** else ***REMOVED***
                    console.log(`$***REMOVED***card.setName***REMOVED*** not found`);
                ***REMOVED***
            ***REMOVED***));
        ***REMOVED*** catch (error) ***REMOVED***
            console.log(error);
        ***REMOVED***
    ***REMOVED***
***REMOVED***

exports.getAndPopulateBulkData = async () => ***REMOVED***
    try ***REMOVED***
        console.log("Downloadeding bulk data");

        const outputDBConfig = ***REMOVED*** dbURL : databaseConnection.url, 
                                 collection : 'cards',
                                 batchSize : 100 ***REMOVED***;
        const dbWriteStream = streamToMongoDB(outputDBConfig);

        const transformCard = new Transform(***REMOVED***
            objectMode: true,
            transform(card, encoding, callback) ***REMOVED***
                if(card.lang === "en" && !card.digital && card.set_type !== "token") ***REMOVED***
                    let newCard = ***REMOVED***
                        scryfallId: card.id,
                        name: card.name,
                        cmc: card.cmc,
                        scryfallLink: card.scryfall_uri,
                        set: card.set_name
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

                    //push card object to next stream
                    this.push(newCard);
                ***REMOVED***
                callback();
            ***REMOVED***
          ***REMOVED***);

        request.get("https://archive.scryfall.com/json/scryfall-all-cards.json")
                .pipe(JSONStream.parse('*'))
                .on('data', function(data) ***REMOVED***
                    console.log(data.name);
                ***REMOVED***)
                .pipe(transformCard)
                .pipe(dbWriteStream);
        console.log("Bulk data downloaded");
        //await populateDB(bulkData);
    ***REMOVED*** catch (error) ***REMOVED***
        console.log(error);
    ***REMOVED***
***REMOVED***