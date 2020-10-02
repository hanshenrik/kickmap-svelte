<script lang="ts">
  import { onMount } from "svelte";
  import ConcertList from "./ConcertList.svelte";
  import Map from "./Map.svelte";
  import Geocoder from "./Geocoder.svelte";
  import type { Concert, Feature } from "./types";

  let map: any;

  var concertsCollection = {
    type: "FeatureCollection",
    features: [],
  };

  // TODO: Get metro area ID by using lat,lng here:
  // https://api.songkick.com/api/3.0/search/locations.json?location=geo:{lat,lng}&apikey={your_api_key}
  const areaId = 31422;

  onMount(async () => {
    await fetch(
      `${
        process.env.DEV_MODE ? "http://localhost:3000" : ""
      }/api/concerts?areaId=${areaId}`
    )
      .then((r) => r.json())
      .then((concerts: [Concert]) => {
        concerts.forEach((concert) => {
          console.log(concert);
          // Create a GeoJson feature so we can represent the concert on the map
          const feature = {
            type: "Feature",
            properties: {
              id: concert.id,
              title: concert.displayName,
              date: concert.start.date,
              popularity: concert.popularity,
              artist: "",
              venue: concert.venue.displayName,
              imageURL: "",
              songkickURL: concert.uri,
            },
            geometry: {
              type: "Point",
              coordinates: [concert.location.lng, concert.location.lat],
            },
          };

          if (concert.performance[0]) {
            feature.properties.artist = concert.performance[0].displayName;
            feature.properties.imageURL =
              "http://images.sk-static.com/images/media/profile_images/artists/" +
              concert.performance[0].artist.id +
              "/huge_avatar";
          }

          concertsCollection.features.push(feature);
          // Create some HTML to show info about the concert in the list
          // addConcertSection(feature);
        });

        // addSources();
        // addLayers();
        // console.log("Starting playback");
        // playback(0);
      });
  });
</script>

<style>
  main {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 1fr;
    width: 100%;
    height: 100%;
    text-align: center;
    margin: 0;
  }

  aside {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
  }

  @media (min-width: 640px) {
    main {
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr;
      max-width: none;
    }
  }
</style>

<main>
  <Map bind:map />

  <aside>
    <Geocoder {map} />
    <!-- <ConcertList concerts={concertsCollection.features} /> -->
  </aside>
</main>
