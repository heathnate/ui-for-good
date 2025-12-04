<script>
  import { searchQuery, filteredItems } from './stores.js'
  import { writable } from 'svelte/store'

  // local input model
  let q = ''
  let showDropdown = false
  let inputEl

  // sync local q with global store
  $: searchQuery.set(q)

  // limited dropdown results
  $: results = $filteredItems.slice(0, 6)

  function goTo(route) {
    window.location.hash = route
    // clear search UI
    q = ''
    showDropdown = false
  }

  function openItem(id) {
    goTo('#/item/' + id)
  }
</script>

<header class="nav">
  <div class="nav-inner">
    <h1 class="brand" on:click={() => goTo('#/')}>PantryPeeker</h1>
    <div class="right">
      <nav class="actions">
        <button on:click={() => goTo('#/')}>Stock</button>
        <button on:click={() => goTo('#/employee')}>Employee</button>
      </nav>

      <div class="search">
        <input
          bind:this={inputEl}
          placeholder="Search items..."
          bind:value={q}
          on:input={() => (showDropdown = true)}
          on:focus={() => (showDropdown = true)}
          aria-label="Search items"
        />

        {#if showDropdown}
          <ul class="search-dropdown" on:mouseleave={() => (showDropdown = false)}>
            {#each results as it}
              <li on:mousedown={() => openItem(it.id)}>{it.name} <small class="cat">{it.category}</small></li>
            {/each}
            {#if results.length === 0}
              <li class="empty">No results</li>
            {/if}
          </ul>
        {/if}
      </div>
    </div>
  </div>
</header>

<style>
  .nav {
    background: linear-gradient(90deg, #1f2937, #111827);
    color: #fff;
    padding: 0.5rem 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .nav-inner {
    max-width: 1200px;
    margin: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand {
    font-size: 1.1rem;
    margin: 0;
  }
  .actions button {
    margin-left: 0.6rem;
    background: transparent;
    color: #ddd;
    border: 1px solid rgba(255,255,255,0.06);
    padding: 0.45rem 0.8rem;
  }
  .actions button.active,
  .actions button:hover {
    color: #111;
    background: #ffd166;
    border-color: #ffd166;
  }
  .right { display:flex; align-items:center; gap:0.6rem }
  .search { position:relative }
  .search input { padding:0.45rem 0.6rem; border-radius:6px; border:1px solid rgba(255,255,255,0.06); min-width:220px }
  .search-dropdown { position:absolute; top:110%; right:0; left:0; background:#fff; color:#111; border:1px solid #ddd; border-radius:6px; z-index:50; list-style:none; margin:0; padding:0 }
  .search-dropdown li { padding:0.5rem; cursor:pointer; display:flex; justify-content:space-between }
  .search-dropdown li:hover { background:#f6f6f6 }
  .search-dropdown .cat { color:#666; font-size:0.85em }
  .search-dropdown .empty { color:#888; cursor:default }
</style>
