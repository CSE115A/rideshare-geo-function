const functions = require("firebase-functions");
const { getGeocodes } = require("./middleware");

exports.getGeo = functions.https.onRequest(async (request, response) => {
  const address = request.query.address;

  if (address === undefined || address === "") {
    return response.status(400).send({
      error: true,
      status: 400,
      message: "Params Error: missing or incorrect address format",
    });
  }

  return await getGeocodes({ functions, address })
    .then((res) => {
      return response.status(res.status).send({
        error: res.status > 200,
        status: res.status,
        message: res.message,
      });
    })
    .catch((err) => {
      return response.status(500).send({
        error: true,
        status: 500,
        message: err.message,
      });
    });
});
