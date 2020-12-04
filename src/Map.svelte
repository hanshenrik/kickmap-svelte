<script>
  import { createEventDispatcher } from "svelte";
  import { Map, controls } from "@beyonk/svelte-mapbox";

  const { GeolocateControl, NavigationControl } = controls;

  export let map;
  export let activeConcertMarker;
  export let activeConcertId;
  export let isPlaying;

  const dispatch = createEventDispatcher();

  const handleGeolocate = (e) => {
    const { longitude, latitude } = e.detail.coords;
    dispatch("newLocation", { coordinates: [longitude, latitude] });
  };

  const handleReady = (e) => {
    const mapboxMap = map.getMap();
    const mapbox = map.getMapbox();

    activeConcertMarker = new mapbox.Marker();

    if (!mapboxMap.getSource("concerts")) {
      // Add a new source from our GeoJSON data and set the
      // 'cluster' option to true. GL-JS will add the point_count property to your source data.
      mapboxMap.addSource("concerts", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      mapboxMap.addLayer({
        id: "clusters",
        type: "circle",
        source: "concerts",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });
      mapboxMap.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "concerts",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });
      mapboxMap.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "concerts",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });
      mapboxMap.on("click", "clusters", function (e) {
        var features = mapboxMap.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        var clusterId = features[0].properties.cluster_id;
        mapboxMap
          .getSource("concerts")
          .getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err) return;
            mapboxMap.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });
      mapboxMap.on("mouseenter", "clusters", function () {
        mapboxMap.getCanvas().style.cursor = "pointer";
      });
      mapboxMap.on("mouseleave", "clusters", function () {
        mapboxMap.getCanvas().style.cursor = "";
      });
      mapboxMap.on("click", "unclustered-point", function (e) {
        const concert = e.features[0];
        dispatch("clickOnConcert", { concert });
      });

      mapboxMap.on("mouseenter", "unclustered-point", function () {
        mapboxMap.getCanvas().style.cursor = "pointer";
      });

      mapboxMap.on("mouseleave", "unclustered-point", function () {
        mapboxMap.getCanvas().style.cursor = "";
      });
    }
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
    on:ready={handleReady}
    options={{ scrollZoom: true }}>
    <NavigationControl />
    <GeolocateControl on:geolocate={handleGeolocate} />
  </Map>
</div>
