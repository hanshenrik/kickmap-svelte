const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

export default async (request, response) => {
  const areaId = request.query["areaId"];

  let allData = [];
  let morePagesAvailable = true;
  let currentPage = 0;

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
        results: { event },
        perPage,
        totalEntries,
      },
    } = await res.json();

    const totalPages = Math.ceil(totalEntries / perPage);
    event.forEach((e) => allData.unshift(e));
    morePagesAvailable = currentPage < totalPages;
  }

  response.status(200).send(allData);
};
