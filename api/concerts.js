const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

export default async (request, response) => {
  const areaId = request.query["areaId"];

  let allData = [];
  let morePagesAvailable = true;
  let currentPage = 0;

  if (process.env.NODE_ENV == "development") {
    console.log("NB! Returning fixtures since development mode");
    const fixtures = require("./concerts-fixture.json");
    response.status(200).send(fixtures);
  } else {
    while (morePagesAvailable) {
      currentPage++;

      const res = await fetch(
        "https://api.songkick.com/api/3.0/metro_areas/" +
          areaId +
          "/calendar.json?" +
          new URLSearchParams({
            apikey: process.env.SONGKICK_API_KEY,
            page: currentPage,
          })
      );

      const {
        resultsPage: {
          results: { event: events },
          perPage,
          totalEntries,
        },
      } = await res.json();

      const totalPages = Math.ceil(totalEntries / perPage);
      events.forEach((e) => allData.unshift(e));
      morePagesAvailable = currentPage < totalPages;
    }

    response.status(200).send(allData);
  }
};