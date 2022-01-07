<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "svelte-awesome";
  import {
    faPlayCircle,
    faStopCircle,
  } from "@fortawesome/free-solid-svg-icons";

  import ConcertList from "./ConcertList.svelte";
  import Map from "./Map.svelte";
  import Geocoder from "./Geocoder.svelte";
  import type { Concert, ConcertsCollection, NewLocationEvent } from "./types";
  import { createApiUrl, getRandomNumber } from "./utils";

  const timeAtEachConcert = 4000;

  let map: any | null;
  let activeConcertId: string = "";
  let activeConcertMarker: any | null;
  let isPlaying: boolean = false;
  var playbackTimeoutFunction: number;

  let concertsCollection: ConcertsCollection = {
    type: "FeatureCollection",
    features: [],
  };

  onMount(async () => {
    const osloLngLat: [number, number] = [10.75278, 59.91111];
    handleNewLocation({ detail: { coordinates: osloLngLat } });
  });

  async function getConcerts(areaId) {
    window.clearTimeout(playbackTimeoutFunction);
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

        mapboxMap.getSource("concerts").setData(concertsCollection);

        playFromIndex(0);
      });
  }

  const handleNewLocation = (e: NewLocationEvent) => {
    concertsCollection = {
      ...concertsCollection,
      features: [],
    };

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
      zoom: getRandomNumber(11, 14), // Set a random zoom level for effect
      pitch: getRandomNumber(0, 61), // Pitch for coolness
      bearing: getRandomNumber(-10, 10), // Tilt north direction slightly for even more coolness!
    });
  };

  const handleActiveConcertChanged = (concert) => {
    const mapboxMap = map.getMap();
    const coordinates = concert.geometry.coordinates.slice();
    activeConcertId = concert.properties.id;

    activeConcertMarker.remove().setLngLat(coordinates).addTo(mapboxMap);

    const activeConcertElement = document.getElementById(
      `concert-${activeConcertId}`
    );

    activeConcertElement &&
      activeConcertElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  const handleClickOnConcert = (e) => {
    const {
      detail: { concert },
    } = e;

    handleActiveConcertChanged(concert);

    isPlaying = false;
    window.clearTimeout(playbackTimeoutFunction);
    flyToLatLng(concert.geometry.coordinates);
  };

  const handleTogglePlayback = () => {
    window.clearTimeout(playbackTimeoutFunction);
    if (!isPlaying) {
      isPlaying = true;
      if (activeConcertId) {
        const currentIndex = concertsCollection.features.findIndex(
          (concert) => concert.properties.id === activeConcertId
        );
        playFromIndex(currentIndex + 1);
      } else {
        playFromIndex(0);
      }
    } else {
      isPlaying = false;
    }
  };

  const playFromIndex = (index: number) => {
    isPlaying = true;
    const mapboxMap = map.getMap();
    const nextConcert = concertsCollection.features[index];
    handleActiveConcertChanged(nextConcert);
    flyToLatLng(nextConcert.geometry.coordinates);

    // Once the flight has ended, initiate a timeout that triggers a recursive call
    mapboxMap.once("moveend", function () {
      playbackTimeoutFunction = window.setTimeout(function () {
        // Get index of the next concert.
        // Modulus length makes it 0 if we're at the last index, i.e. we'll start from the beginning again.
        var nextIndex = (index + 1) % concertsCollection.features.length;

        // Recursive call, fly to next concert
        playFromIndex(nextIndex);
      }, timeAtEachConcert); // After callback, stay at the location for x milliseconds
    });
  };
</script>

<main>
  <Map
    on:newLocation={handleNewLocation}
    on:clickOnConcert={handleClickOnConcert}
    bind:map
    bind:activeConcertMarker
  />

  <aside>
    <Geocoder on:newLocation={handleNewLocation} />
    <ConcertList
      concerts={concertsCollection.features}
      {activeConcertId}
      on:clickOnConcert={handleClickOnConcert}
    />
    <div class="songkick-logo-and-play-button">
      <button class="playback-button" on:click={handleTogglePlayback}>
        <Icon
          data={isPlaying ? faStopCircle : faPlayCircle}
          spin={isPlaying}
          scale={3}
        />
      </button>
      <img
        alt="Powered by Songkick"
        class="songkick-attribution"
        src="images/powered-by-songkick-black.svg"
      />
    </div>
  </aside>
</main>

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

  .songkick-logo-and-play-button {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .playback-button {
    transition: color 0.2s ease-in-out;
  }
  .playback-button:hover {
    color: #51bbd6;
  }
</style>
