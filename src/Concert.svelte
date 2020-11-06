<script lang="ts">
  import Icon from "svelte-awesome";
  import { faCalendar } from "@fortawesome/free-regular-svg-icons";
  import {
    faMapMarkerAlt,
    faMicrophone,
  } from "@fortawesome/free-solid-svg-icons";

  import type { Feature } from "./types";

  export let concert: Feature;
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
  }
  .concert-content {
    display: flex;
    align-content: center;
    align-items: center;
    gap: 1rem;
  }
  .concert-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .artist-img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  .artist-img:hover {
    transform: scale(1.025);
  }
  .artist-img.placeholder {
    background-color: lightyellow;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
  }
</style>

<div id={`concert-${concert.properties.id}`} class="concert">
  <h3>{concert.properties.title}</h3>
  <div class="concert-content">
    <a href={concert.properties.songkickURL} target="_blank">
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
    </a>
    <div class="concert-info">
      <div>
        <Icon data={faMapMarkerAlt} />

        {concert.properties.venue}
      </div>
      <div>
        <Icon data={faCalendar} />
        {concert.properties.date}
      </div>

      <a href={concert.properties.songkickURL} target="_blank">Mer info</a>
    </div>
  </div>
</div>
