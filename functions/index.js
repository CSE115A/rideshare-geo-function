const functions = require('firebase-functions');
const axios = require('axios');

exports.getGeo = functions.https.onRequest(async (request, response) =>{
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const apikey = functions.config().location.key;
    let bodyResp = {};
    let address;
    try{
        address = request.query.address;
    } catch(error) {
        // missing address as params
        return response.status(400).send({
            error: true,
            status: 400,
            message: "Params Error: missing or incorrect address format"
        });
    }
    await axios.get(url,{
        params: {
            address,
            key: apikey
        }
    })
    .then( (resp) => {
        if (resp.data.status === 'REQUEST_DENIED'){
            // invalid api key
            return response.status(500).send({
                error: true,
                status: 500,
                message: "Internal Server Error",
            });
        }
        // valid request: correct address
        bodyResp.geo = resp.data.results[0].geometry.location;
        bodyResp.id = resp.data.results[0].place_id;
        return response.status(200).send({
            error: false,
            status: 200,
            message: bodyResp
        });
    })
    .catch ( (err) => {
        // incorrect address format
        return response.status(400).send({
            error: true,
            status: 400,
                message: "Params Error: missing or incorrect address format",
        });
    })
    return response;
});