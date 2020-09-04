const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

export default async (request, response) => {
  const areaId = request.query["areaId"];

  // TODO: Fetch all pages
  const res = await fetch(
    "https://api.songkick.com/api/3.0/metro_areas/" +
      areaId +
      "/calendar.json?" +
      new URLSearchParams({
        apikey: process.env.SONGKICK_API_KEY,
        page: 1,
      })
  );
  const json = await res.json();

  response.status(200).send(json);
};
