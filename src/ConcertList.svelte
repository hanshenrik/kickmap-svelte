<script lang="ts">
  import VirtualList from "@sveltejs/svelte-virtual-list";
  import Concert from "./Concert.svelte";

  import type { Feature } from "./types";

  export let concerts: Feature[];
</script>

<style>
  .container {
    min-height: 200px;
    width: 100%;
    border-top: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
    height: calc(100vh - 4rem - 38px - 44px);
  }
</style>

<div class="container">
  {#if concerts.length > 0}
    <VirtualList items={concerts} let:item>
      <Concert concert={item} />
    </VirtualList>
  {:else}Henter data...{/if}
</div>
