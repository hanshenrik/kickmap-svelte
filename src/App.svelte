<script lang="ts">
  import { onMount } from "svelte";

  import ConcertList from "./ConcertList.svelte";
  import Map from "./Map.svelte";
  import Geocoder from "./Geocoder.svelte";
  import ConcertElement from "./Concert.svelte";
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

        const mapboxMap = map.getMap();
        const mapbox = map.getMapbox();

        // TODO: Improve initing to make sure map is ready. Extract in separate function etc.
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
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            mapboxMap.panTo(coordinates);

            // TODO: Maybe don't show anything, but just scroll to concert in concert list and mark 'active'?
            new mapbox.Popup({})
              .setLngLat(coordinates)
              .setHTML('<div id="concert-popup"></div>')
              .addTo(mapboxMap);

            new ConcertElement({
              target: document.getElementById("concert-popup"),
              props: { concert: e.features[0] },
            });
          });

          mapboxMap.on("mouseenter", "unclustered-point", function () {
            mapboxMap.getCanvas().style.cursor = "pointer";
          });

          mapboxMap.on("mouseleave", "unclustered-point", function () {
            mapboxMap.getCanvas().style.cursor = "";
          });
        }

        mapboxMap.getSource("concerts").setData(concertsCollection);

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
