<script lang="ts">
  import Icon from "svelte-awesome";
  import { faCalendar } from "@fortawesome/free-regular-svg-icons";
  import {
    faMapMarkerAlt,
    faMicrophone,
    faInfoCircle,
  } from "@fortawesome/free-solid-svg-icons";

  import type { Feature } from "./types";

  export let concert: Feature;
  export let activeConcertId: string;

  const replaceHttpWithHttps = (url: string) =>
    url.replace(/^http:\/\//i, "https://");
</script>

<div
  id={`concert-${concert.properties.id}`}
  class="concert"
  class:active={activeConcertId === concert.properties.id}
>
  <div class="concert-content">
    {#if concert.properties.imageURL}
      <img
        src={replaceHttpWithHttps(concert.properties.imageURL)}
        class="artist-img"
        class:active={activeConcertId === concert.properties.id}
        alt={`Bilde av ${concert.properties.title}`}
      />
    {:else}
      <div class="artist-img placeholder">
        <Icon data={faMicrophone} scale="2" />
      </div>
    {/if}
    <div>
      <h3>{concert.properties.artist || concert.properties.title}</h3>
      <div
        class="concert-info"
        class:active={activeConcertId === concert.properties.id}
      >
        <Icon data={faMapMarkerAlt} />
        {concert.properties.venue}
        <Icon data={faCalendar} />
        {new Intl.DateTimeFormat("nb-NO").format(
          new Date(concert.properties.date)
        )}
        <Icon data={faInfoCircle} />
        <a href={concert.properties.songkickURL} target="_blank">Mer info</a>
      </div>
    </div>
  </div>
</div>

<style>
  h3 {
    margin: 0;
    height: 100%;
  }

  .concert {
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    background-color: white;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
    transition: transform 0.5s ease-out;
  }
  .concert.active {
    height: auto;
    background-color: #e3f2fd;
    transform: scale(1.075);
  }
  .concert.active h3 {
    margin-bottom: 1rem;
  }
  .concert-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    align-items: center;
    text-align: left;
    grid-gap: 1rem;
  }
  .concert-info {
    opacity: 0;
    visibility: hidden;
    height: 0;
  }
  .concert-info.active {
    display: grid;
    opacity: 1;
    height: auto;
    visibility: visible;
    transition: all 0.5s ease-out;
    grid-template-columns: 1rem auto;
    grid-gap: 0.5rem;
  }
  .artist-img {
    height: 50px;
    width: 50px;
    transition: all 0.5s ease-out;
    border-radius: 50%;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
  }
  .artist-img.active {
    height: 80px;
    width: 80px;
  }
  .artist-img.placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
  }
</style>
