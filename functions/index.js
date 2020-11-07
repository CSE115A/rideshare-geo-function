const functions = require('firebase-functions');
const axios = require('axios');

exports.GeoTest = functions.https.onRequest(async (request, response) =>{
    // parse request 
    // request should contian source and destination address
    let url = 'https://maps.googleapis.com/maps/api/geocode/json'
    let apikey = functions.config().location.key
    let bodyResp = {}
    try{
        let address = request.query.address;
        await axios.get(url,{
            params: {
                address: address,
                key: apikey
            }
        })
        .then( response => {
            bodyResp.geo = response.data.results[0].geometry.location;
            bodyResp.id = response.data.results[0].place_id;
        })
        .catch ( err => {
            console.log(err);
        })
        response.status(200).send(bodyResp);
        
    } catch (err){
        // invalid request body
        functions.logger.error(err);
        response.status(400).send(err);
    }
});