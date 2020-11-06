const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

export default async (request, response) => {
  const lat = request.query["lat"];
  const lng = request.query["lng"];

  if (process.env.NODE_ENV == "development") {
    console.log("DEV_MODE: Returning fixed metro id");

    const {
      resultsPage: {
        results: { location: locations },
      },
    } = require("./locations-fixture.json");

    const firstMetroAreaId = locations && locations[0].metroArea.id;

    response.status(200).send(firstMetroAreaId);
  } else {
    const res = await fetch(
      "https://api.songkick.com/api/3.0/search/locations.json?" +
        new URLSearchParams({
          apikey: process.env.SONGKICK_API_KEY,
          location: `geo:${lat},${lng}`,
        })
    );

    const {
      resultsPage: {
        results: { location: locations },
      },
    } = await res.json();

    const firstMetroAreaId = locations && locations[0].metroArea.id;

    response.status(200).send(firstMetroAreaId);
  }
};
