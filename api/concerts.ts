import { NowRequest, NowResponse } from "@vercel/node";

const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

export default async (request: NowRequest, response: NowResponse) => {
  // TODO: Take areaID as a request parameter, select area in UI
  const areaID = 31422;

  // TODO: Fetch all pages
  const res = await fetch(
    "https://api.songkick.com/api/3.0/metro_areas/" +
      areaID +
      "/calendar.json?" +
      new URLSearchParams({
        apikey: process.env.SONGKICK_API_KEY,
        page: 1,
      })
  );
  const json = await res.json();

  response.status(200).send(json);
};
