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
</script>

<style>
  h3 {
    margin-top: 0;
  }

  .concert {
    padding: 1rem;
    border-radius: 2px;
    margin-bottom: 1rem;
    background-color: white;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
    transition: transform 0.5s ease-in-out;
  }
  .concert.active {
    background-color: #e3f2fd;
    transform: scale(1.075);
  }
  .concert-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    align-content: center;
    align-items: center;
    grid-gap: 1rem;
  }
  .concert-info {
    display: grid;
    grid-template-columns: 1rem auto;
    grid-gap: 0.5rem;
  }
  .artist-img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
  }
  .artist-img.placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
  }
</style>

<div
  id={`concert-${concert.properties.id}`}
  class="concert"
  class:active={activeConcertId === concert.properties.id}>
  <h3>{concert.properties.artist || concert.properties.title}</h3>
  <div class="concert-content">
    {#if concert.properties.imageURL}
      <img
        src={concert.properties.imageURL}
        class="artist-img"
        alt={`Bilde av ${concert.properties.title}`} />
    {:else}
      <div class="artist-img placeholder">
        <Icon data={faMicrophone} scale="2" />
      </div>
    {/if}
    <div class="concert-info">
      <Icon data={faMapMarkerAlt} />
      {concert.properties.venue}
      <Icon data={faCalendar} />
      {new Intl.DateTimeFormat('nb-NO').format(new Date(concert.properties.date))}
      <Icon data={faInfoCircle} />
      <a href={concert.properties.songkickURL} target="_blank">Mer info</a>
    </div>
  </div>
</div>
