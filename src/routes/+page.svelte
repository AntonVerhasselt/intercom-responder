<script>
  import { onMount } from 'svelte';

  let documentData = null;
  let documentCount = 0;
  let isError = false;

  function updateTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  function handleThemeChange(event) {
    const theme = event.target.checked ? 'dark' : 'light';
    updateTheme(theme);
  }

  onMount(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDarkMode = savedTheme === 'dark';
    document.getElementById('theme-toggle').checked = isDarkMode;
    updateTheme(savedTheme);
    loadDocument();
  });

  async function loadDocument() {
    try {
      const response = await fetch('/api/review');
      const data = await response.json();
      if (response.ok && data.status === "Success") {
        documentData = data.data;
        documentCount = data.count;
        isError = false;
      } else {
        isError = true;
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      isError = true;
    }
  }

  async function submitReview(isPositive) {
    if (!documentData._id) {
      console.error('No document ID available for review submission.');
      return;
    }
    try {
      console.log('function called')
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentId: documentData._id,
          goodCategory: isPositive
        })
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Review submitted:', result);
        await loadDocument();
      } else {
        console.error('Error submitting review:', result);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  }
</script>

<main class="flex flex-col items-center justify-center h-screen relative">
  {#if documentData && documentData._id}
  <div class="indicator">
    <span class="indicator-item badge badge-accent">{documentCount}</span>
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <p>
          {#if documentData.categoryPrompt && documentData.categoryPrompt.length > 1}
            {documentData.categoryPrompt[1]?.content}
          {:else}
            'No prompt content available'
          {/if}
        </p>
        <div class="card-actions justify-center">
          {#if documentData.category && documentData.category.category_name}
            <div class="badge badge-secondary">
              {documentData.category.category_name}
            </div>
          {:else}
            <div class="badge badge-outline">No category</div>
          {/if}
        </div>
      </div>
    </div></div>
    <div class="flex justify-center mt-4 space-x-4">
      <button class="btn btn-error" on:click="{() => submitReview(false)}">Negative</button>
      <button class="btn btn-success" on:click="{() => submitReview(true)}">Positive</button>
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

  <input type="checkbox" id="theme-toggle" value="synthwave" class="toggle theme-controller bg-amber-300 border-sky-400 [--tglbg:theme(colors.sky.500)] checked:bg-blue-300 checked:border-blue-800 checked:[--tglbg:theme(colors.blue.900)] absolute bottom-5 right-5" on:change={handleThemeChange} />
</main>
