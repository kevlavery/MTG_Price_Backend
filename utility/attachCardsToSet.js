var request = require('request');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');

exports.getSets = async () => {
    TCGAuthentication.getToken().then((token) => { 
        let bearer = token;
        const authorization = 'bearer ' + bearer;

        try {
            let setQuery = await Sets.find({}).exec();
        } catch (error) {
            console.log(error);
        }  
        
        return request({
            url: "http://api.tcgplayer.com/catalog/categories/1/search",
            method: "POST",
            headers: {
                "Authorization": authorization,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: data
        }, (error, response, body) => {
    });   
}



  
