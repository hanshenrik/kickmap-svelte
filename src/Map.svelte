<script>
  import { Map, Marker, controls } from "@beyonk/svelte-mapbox";

  const { GeolocateControl, NavigationControl, ScaleControl } = controls;

  export let map;

  // Define this to handle `eventname` events - see [GeoLocate Events](https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-events)
  function eventHandler(e) {
    const data = e.detail;
    // do something with `data`, it's the result returned from the mapbox event
  }
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
    options={{ scrollZoom: false }}>
    <Marker
      lat={10.1}
      lng={73.0}
      color="rgb(255,255,255)"
      label="some marker label"
      popupClassName="class-name" />
    <NavigationControl />
    <GeolocateControl
      options={{ some: 'control-option' }}
      on:eventname={eventHandler} />
    <ScaleControl />
  </Map>
</div>
