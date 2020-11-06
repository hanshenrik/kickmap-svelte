<script lang="ts">
  import MapMarker from "svelte-material-icons/MapMarker.svelte";
  import Calendar from "svelte-material-icons/Calendar.svelte";

  import type { Feature } from "./types";

  export let concert: Feature;
</script>

<style>
  .concert {
    text-align: left;
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
  }
  .concert-content {
    display: flex;
    align-content: center;
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
  }
</style>

<div class="concert">
  <h3>{concert && concert.properties.title}</h3>
  <div class="concert-content">
    <a href={concert && concert.properties.songkickURL} target="_blank">
      <img
        src={concert && concert.properties.imageURL}
        class="artist-img"
        alt={`Bilde av ${concert && concert.properties.title}`} />
    </a>
    <div class="concert-info">
      <div>
        <MapMarker />
        {concert && concert.properties.venue}
      </div>
      <div>
        <Calendar />
        {concert && concert.properties.date}
      </div>

      <a href={concert && concert.properties.songkickURL} target="_blank">Mer
        info</a>
    </div>
  </div>
</div>
