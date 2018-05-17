var restCredentials = require('../data/connectionData.json');
var request = require('request');

const data = 'grant_type=client_credentials&client_id='
                + restCredentials.publicKey
                + '&client_secret='
                + restCredentials.privateKey;
    
exports.getToken = () => {
    request({
        url: "http://api.tcgplayer.com/token", //look to see if they support HTTPS
        method: "POST",
        headers: {
            "content-type": "application/json",  // <--Very important!!!
        },
        body: data
    }, (error, response, body) => {
        console.log(body)
    });
}



  
