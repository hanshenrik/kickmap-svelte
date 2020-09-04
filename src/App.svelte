<script lang="ts">
  import { onMount } from "svelte";

  export let name: string;
  var concertsCollection = {
    type: "FeatureCollection",
    features: [],
  };

  const areaId = 31422;

  onMount(async () => {
    await fetch(
      `${
        process.env.DEV_MODE ? "http://localhost:3000" : ""
      }/api/concerts?areaId=${areaId}`
    )
      .then((r) => r.json())
      .then((concerts) => {
        console.log(concerts);
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
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Hello {name}!</h1>
  <div id="map" />

  <div id="concerts">
    <img
      alt="Powered by Songkick"
      class="songkick-attribution"
      src="images/powered-by-songkick-black.svg" />
  </div>
</main>
