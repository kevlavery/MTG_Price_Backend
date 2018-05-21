var request = require('request');
var token = require('./token');

exports.getSets = () => {
    var token = 

    request({
        url: "https://api.tcgplayer.com/catalog/categories/1/search/manifest", 
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"  
        },
        body: data
    }, (error, response, body) => {
        var token = JSON.parse(body);
        var currentToken = new token({
            access_token: token.access_token,
            expiry_date: token['.expires']
        });
        
        currentToken.save((err) => {
            if (err) console.log(err);
        });
        console.log(currentToken);
    });
}



  
