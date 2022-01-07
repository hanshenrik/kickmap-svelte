<script>
  import { createEventDispatcher } from "svelte";
  import { Geocoder } from "@beyonk/svelte-mapbox";

  const dispatch = createEventDispatcher();

  const handleResult = (e) =>
    dispatch("newLocation", { coordinates: e.detail.result.center });
</script>

<Geocoder
  accessToken={process.env.MAPBOX_ACCESS_TOKEN}
  on:result={handleResult}
  placeholder="Søk etter by"
  types={["region", "place"]}
/>
