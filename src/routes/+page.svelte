<script>
  import { onMount } from 'svelte';

  let documentData = {};
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
  });

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

<main class="flex items-center justify-center h-screen relative">
  {#if Object.keys(documentData).length > 0}
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="card-title">
          {#if documentData.categoryPrompt && documentData.categoryPrompt.length > 1}
            {documentData.categoryPrompt[1]?.content}
          {:else}
            'No prompt content available'
          {/if}
        </h1>
        <div class="card-actions justify-end">
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

  <!-- Theme toggle switch -->
  <input type="checkbox" id="theme-toggle" value="synthwave" class="toggle theme-controller bg-amber-300 border-sky-400 [--tglbg:theme(colors.sky.500)] checked:bg-blue-300 checked:border-blue-800 checked:[--tglbg:theme(colors.blue.900)] absolute bottom-5 right-5" on:change={handleThemeChange} />
</main>
