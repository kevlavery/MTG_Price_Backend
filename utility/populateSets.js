var request = require('request');
var TCGAuthentication = require('./token');

exports.getSets = () => {
    TCGAuthentication.getToken().then((token) => { 
        let bearer = token;
        
        const authorization = 'bearer ' + bearer;

        console.log(authorization);

        request({
            url: "https://api.tcgplayer.com/catalog/categories/1/search/manifest", 
            method: "GET",
            headers: {
                "Authorization": authorization,
                "Content-Type": "application/json",
                "Accept": "application/json"  
            }
        }, (error, response, body) => {
            result = JSON.parse(body);
            console.log(result.results[0].filters[2].items);
        });
    });
    
}



  
