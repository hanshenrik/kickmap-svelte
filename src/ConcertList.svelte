<script lang="ts">
  import type { Feature } from "./types";
  export let concerts: [Feature];
</script>

<style>
</style>

<div id="concerts">
  {#each concerts as concert}
    <div id={concert.properties.id} class="concert">
      {concert.properties.title}
    </div>
  {:else}
    <p>Loading...</p>
  {/each}
  <img
    alt="Powered by Songkick"
    class="songkick-attribution"
    src="images/powered-by-songkick-black.svg" />
</div>
