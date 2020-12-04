const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const isNotCancelled = (event) => event.status !== "cancelled";

export default async (request, response) => {
  const areaId = request.query["areaId"];
  const maxPages = 2;

  let morePagesAvailable = true;
  let allData = [];
  let currentPage = 0;

  if (process.env.NODE_ENV == "development") {
    console.log("DEV_MODE: Returning concert fixtures");
    const fixtures = require("./concerts-fixture.json");
    const nonCancelledEvents = fixtures.filter(isNotCancelled);
    response.status(200).send(nonCancelledEvents);
  } else {
    try {
      while (morePagesAvailable && currentPage < maxPages) {
        currentPage++;

        const res = await fetch(
          "https://api.songkick.com/api/3.0/metro_areas/" +
            areaId +
            "/calendar.json?" +
            new URLSearchParams({
              apikey: process.env.SONGKICK_API_KEY,
              page: currentPage,
              min_date: new Date().toISOString().slice(0, 10),
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

        if (events) {
          const nonCancelledEvents = events.filter(isNotCancelled);
          allData = [...allData, ...nonCancelledEvents];
        }

        morePagesAvailable = currentPage < totalPages;
      }

      response.status(200).send(allData);
    } catch (error) {
      console.error(error);
      response.status(500).send({ error: "Something went wrong :(" });
    }
  }
};
