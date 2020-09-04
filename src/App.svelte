<script lang="ts">
  import { onMount } from "svelte";

  export let name: string;

  onMount(async () => {
    await fetch(`${process.env.VERCEL_URL}/api/concerts`)
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
      });
  });
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Hello {name}!</h1>
  <div id="map" />

  <div id="concerts">
    <img
      alt="Powered by Songkick"
      class="songkick-attribution"
      src="images/powered-by-songkick-black.svg" />
  </div>
</main>
