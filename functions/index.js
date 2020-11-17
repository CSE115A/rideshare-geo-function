const functions = require("firebase-functions");
const { getGeocodes } = require("./middleware");

exports.getGeo = functions.https.onRequest(async (request, response) => {
  const address = request.query.address;

  if (address === undefined) {
    return response.status(400).send({
      error: true,
      status: 400,
      message: "Params Error: missing or incorrect address format",
    });
  }
  return await getGeocodes({ functions, address })
    .then((res) => {
      return response.status(200).send({
        error: false,
        status: 200,
        message: res.message,
      });
    })
    .catch((err) => {
      const message = err.message;
      if (message.includes("REQUEST_DENIED")) {
        return response.status(500).send({
          error: true,
          status: 500,
          message: message,
        });
      } else {
        return response.status(400).send({
          error: true,
          status: 400,
          message: message,
        });
      }
    });
});
