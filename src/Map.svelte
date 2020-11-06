<script>
  import { createEventDispatcher } from "svelte";
  import { Map, Marker, controls } from "@beyonk/svelte-mapbox";

  const { GeolocateControl, NavigationControl, ScaleControl } = controls;

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
    style="mapbox://styles/mapbox/dark-v10"
    bind:this={map}
    on:recentre={(e) => console.log(e.detail.center.lat, e.detail.center.lng)}
    options={{ scrollZoom: true }}>
    <Marker
      lat={10.1}
      lng={73.0}
      color="rgb(255,255,255)"
      label="some marker label"
      popupClassName="class-name" />
    <NavigationControl />
    <GeolocateControl on:geolocate={handleGeolocate} />
    <ScaleControl />
  </Map>
</div>
