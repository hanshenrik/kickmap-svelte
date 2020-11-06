<script>
  import { Geocoder } from "@beyonk/svelte-mapbox";
  import { createApiUrl, getRandomNumber } from "./utils";

  export let map;
  export let areaId;

  async function handleNewLocation(e) {
    const [lng, lat] = e.detail.result.center;

    await fetch(
      createApiUrl(process.env.DEV_MODE, `/api/area?lat=${lat}&lng=${lng}`)
    )
      .then((r) => r.json())
      .then((metroAreaId) => {
        areaId = metroAreaId;
      });

    flyToLatLng(e);
  }

  function flyToLatLng(e) {
    map.flyTo({
      center: e.detail.result.center,
      speed: getRandomNumber(0.5, 1), // Speed of the flight
      curve: getRandomNumber(1, 1.5), // How far 'out' we should zoom on the flight from A to B
      zoom: getRandomNumber(10, 14), // Set a random zoom level for effect
      pitch: getRandomNumber(0, 61), // Pitch for coolness
      bearing: getRandomNumber(-10, 10), // Tilt north direction slightly for even more coolness!
    });
  }
</script>

<Geocoder
  accessToken={process.env.MAPBOX_ACCESS_TOKEN}
  on:result={handleNewLocation}
  placeholder="Søk etter by"
  types={['region', 'place']} />
