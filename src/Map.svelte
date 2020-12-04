<script>
  import { createEventDispatcher } from "svelte";
  import { Map, controls } from "@beyonk/svelte-mapbox";

  const { GeolocateControl, NavigationControl } = controls;

  export let map;

  const dispatch = createEventDispatcher();

  const handleGeolocate = (e) => {
    const { longitude, latitude } = e.detail.coords;
    dispatch("newLocation", { coordinates: [longitude, latitude] });
  };
</script>

<style>
  :global(.mapboxgl-map) {
    height: 200px; /* sometimes mapbox objects don't render as expected; troubleshoot by changing the height/width to px */
  }
  .map-wrapper {
    width: 100%;
    height: 100%;
  }
</style>

<div class="map-wrapper">
  <Map
    accessToken={process.env.MAPBOX_ACCESS_TOKEN}
    style="mapbox://styles/mapbox/light-v10"
    bind:this={map}
    options={{ scrollZoom: true }}>
    <NavigationControl />
    <GeolocateControl on:geolocate={handleGeolocate} />
  </Map>
</div>
