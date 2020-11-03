const functions = require('firebase-functions');

exports.GeoTest = functions.https.onRequest((request, response) =>{
    // parse request 
    // request should contian source and destination address
    let url = 'https://maps.googleapis.com/maps/api/geocode/json'
    let apikey = functions.config().location.key
    try{
        // read body
        let address = request.body.address;
        let param = address.replace(' ','+');
        
        
    } catch (err){
        // invalid request body
        functions.logger.error(err);
        response.status(400).send('invalid json format');
    }
})