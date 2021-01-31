<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Icon from "svelte-awesome";
  import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";

  import Concert from "./Concert.svelte";
  import type { Feature } from "./types";

  export let concerts: Feature[];
  export let activeConcertId: string;

  const dispatch = createEventDispatcher();

  const handleConcertClick = (concert) =>
    dispatch("clickOnConcert", { concert });
</script>

<div class="container">
  <div class="concert-list">
    {#if concerts.length > 0}
      {#each concerts as concert}
        <button
          class="concert-button"
          on:click={() => handleConcertClick(concert)}
        >
          <Concert {concert} {activeConcertId} />
        </button>
      {/each}
    {:else}
      <div class="loading-icon">
        <Icon data={faCompactDisc} scale="4" spin />
      </div>
      <p>Laster inn konserter...</p>
    {/if}
  </div>
</div>

<style>
  .container {
    min-height: 200px;
    width: 100%;
    border-top: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
    height: calc(100vh - 4rem - 38px - 56px);
    overflow-x: scroll;
  }

  .concert-list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
    overflow-x: scroll;
  }
  @media screen and (min-width: 812px) {
    .container {
      overflow-x: visible;
      overflow-y: scroll;
    }
    .concert-list {
      flex-direction: column;
      overflow-x: scroll;
    }
  }

  .loading-icon {
    padding: 1rem;
  }
</style>
