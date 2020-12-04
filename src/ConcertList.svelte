<script lang="ts">
  import VirtualList from "@sveltejs/svelte-virtual-list";
  import Icon from "svelte-awesome";
  import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";

  import Concert from "./Concert.svelte";
  import type { Feature } from "./types";

  export let concerts: Feature[];
  export let activeConcertId: string;
</script>

<style>
  .container {
    min-height: 200px;
    width: 100%;
    border-top: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
    height: calc(100vh - 4rem - 38px - 44px);
    display: flex;
    justify-content: center;
  }

  .loading-icon {
    padding: 1rem;
  }
  :global(svelte-virtual-list-viewport) {
    width: 100%;
  }
  :global(svelte-virtual-list-row) {
    overflow: visible !important;
  }

  :global(svelte-virtual-list-contents) {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
</style>

<div class="container">
  {#if concerts.length > 0}
    <VirtualList items={concerts} let:item>
      <Concert concert={item} activeConcertId={activeConcertId} />
    </VirtualList>
  {:else}
    <div class="loading-icon">
      <Icon data={faCompactDisc} scale="4" spin />
    </div>
  {/if}
</div>
