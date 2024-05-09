<script> 
  import { onMount } from 'svelte';
  import { fetchRandomDocument } from '$lib/mongoOperations';

  let documentData = {};

  onMount(async () => {
    console.log("Calling fetchRandomDocument...");
    const response = await fetchRandomDocument();
    console.log("Response from fetchRandomDocument:", response);
    documentData = response.body;
  });
</script>
  
<main class="flex items-center justify-center h-screen">
  {#if Object.keys(documentData).length > 0}
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="card-title">{documentData.categoryPrompt[1].content}</h1>
        <div class="card-actions justify-end">
          <div class="badge badge-secondary">{documentData.category.category_name}</div>
        </div>
      </div>
    </div>
  {:else}
    <div>Loading...</div>
  {/if}
</main>
  
  