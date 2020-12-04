<script lang="ts">
  import { onMount } from "svelte";

  import ConcertList from "./ConcertList.svelte";
  import Map from "./Map.svelte";
  import Geocoder from "./Geocoder.svelte";
  import type { Concert, ConcertsCollection, NewLocationEvent } from "./types";
  import { createApiUrl, getRandomNumber } from "./utils";

  let map: any | null;

  let concertsCollection: ConcertsCollection = {
    type: "FeatureCollection",
    features: [],
  };

  onMount(async () => {
    const osloLngLat: [number, number] = [10.75278, 59.91111];
    handleNewLocation({ detail: { coordinates: osloLngLat } });
  });

  async function getConcerts(areaId) {
    await fetch(
      createApiUrl(process.env.DEV_MODE, `/api/concerts?areaId=${areaId}`)
    )
      .then((r) => r.json())
      .then((concerts: [Concert]) => {
        concertsCollection = {
          ...concertsCollection,
          features: concerts.map((concert) => {
            // console.log(concert);
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
              feature.properties.imageURL = `http://images.sk-static.com/images/media/profile_images/artists/${concert.performance[0].artist.id}/huge_avatar`;
            }

            return feature;
          }),
        };

        // addSources();
        // addLayers();
        // console.log("Starting playback");
        // playback(0);
      });
  }

  const handleNewLocation = (e: NewLocationEvent) => {
    concertsCollection = {
      ...concertsCollection,
      features: [],
    };

    flyToLatLng(e.detail.coordinates);

    const [lng, lat] = e.detail.coordinates;

    fetch(createApiUrl(process.env.DEV_MODE, `/api/area?lat=${lat}&lng=${lng}`))
      .then((r) => r.json())
      .then((metroAreaId) => getConcerts(metroAreaId));
  };

  const flyToLatLng = (coordinates) => {
    map.flyTo({
      center: coordinates,
      speed: getRandomNumber(0.5, 1), // Speed of the flight
      curve: getRandomNumber(1, 1.5), // How far 'out' we should zoom on the flight from A to B
      zoom: getRandomNumber(10, 14), // Set a random zoom level for effect
      pitch: getRandomNumber(0, 61), // Pitch for coolness
      bearing: getRandomNumber(-10, 10), // Tilt north direction slightly for even more coolness!
    });
  };
</script>

<style>
  main {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  aside {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    width: 330px;
    max-width: 100%;
    display: grid;
    grid-gap: 1rem;
    justify-items: center;
    padding: 1rem 0;
  }

  .songkick-attribution {
    max-width: 120px;
  }
</style>

<main>
  <Map bind:map on:newLocation={handleNewLocation} />

  <aside>
    <Geocoder on:newLocation={handleNewLocation} />
    <ConcertList concerts={concertsCollection.features} />
    <img
      alt="Powered by Songkick"
      class="songkick-attribution"
      src="images/powered-by-songkick-black.svg" />
  </aside>
</main>
