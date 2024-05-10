<script>
  import { onMount } from "svelte";

  let documentData = {};
  let isError = false;

  onMount(async () => {
    try {
      const response = await fetch('/api/review');
      const data = await response.json();
      if (response.ok && data.status === "Success") {
        documentData = data.data;
      } else {
        isError = true;
      }
    } catch (error) {
      isError = true;
    }
  });
</script>

<main class="flex items-center justify-center h-screen">
  {#if Object.keys(documentData).length > 0}
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <!-- Assuming categoryPrompt is an array of objects with 'content' -->
        <h1 class="card-title">
          {#if documentData.categoryPrompt && documentData.categoryPrompt.length > 1}
            {documentData.categoryPrompt[1]?.content}
          {:else}
            'No prompt content available'
          {/if}
        </h1>
        <div class="card-actions justify-end">
          <!-- Check if category and category_name exist before rendering -->
          {#if documentData.category && documentData.category.category_name}
            <div class="badge badge-secondary">
              {documentData.category.category_name}
            </div>
          {:else}
            <div class="badge badge-outline">No category</div>
          {/if}
        </div>
      </div>
    </div>
  {:else if isError}
    <div>
      <h3>Error loading document.</h3>
    </div>
  {:else}
    <div>
      <h3>Loading...</h3>
    </div>
  {/if}
</main>
