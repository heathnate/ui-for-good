<script>
  import {
    itemsStore,
    categories,
    filteredItems,
    selectedCategory,
    selectedCategoryDisplayName,
    searchQuery,
  } from "./stores.js";
  import ItemCard from "./ItemCard.svelte";
  import { onMount } from "svelte";

  let category = "All";
  let query = "";
  let onlyAvailable = false;
  // base comes from global filteredItems (header search and category filter applied)
  let base = [];
  const unsubscribe = filteredItems.subscribe((v) => (base = v));

  // Sync local category with selectedCategory store
  const unsubCategory = selectedCategory.subscribe((cat) => {
    if (cat) {
      // Find matching category in the list (case-insensitive)
      const match = $categories.find(
        (c) => c.toLowerCase() === cat.toLowerCase()
      );
      category = match || "All";
    }
  });

  $: filtered = base
    .filter((i) => (category === "All" ? true : i.category === category))
    .filter((i) => (onlyAvailable ? i.quantity > 0 : true));

  function clearFilters() {
    selectedCategory.set("");
    searchQuery.set("");
    category = "All";
    window.location.hash = "#/stock";
  }

  onMount(() => {
    return () => {
      unsubscribe();
      unsubCategory();
    };
  });
</script>

<section class="page-container">
  <div class="header">
    <h2>Stock</h2>
    {#if $selectedCategory || $searchQuery}
      <button on:click={clearFilters} class="clear-btn">Clear filters</button>
    {/if}
  </div>

  {#if $selectedCategory}
    <p class="filter-info">
      Showing category: <strong>{$selectedCategoryDisplayName}</strong>
    </p>
  {/if}

  <div class="controls">
    <div class="left">
      <label
        >Category
        <select bind:value={category}>
          {#each $categories as c}
            <option value={c}>{c}</option>
          {/each}
        </select>
      </label>
      <label
        >Search
        <input placeholder="Search items" bind:value={query} />
      </label>
    </div>
    <div class="right">
      <label class="inline"
        ><input type="checkbox" bind:checked={onlyAvailable} /> Only available</label
      >
    </div>
  </div>

  <div class="grid">
    {#if filtered.length === 0}
      <div class="empty">No items found</div>
    {/if}
    {#each filtered as it (it.id)}
      <ItemCard
        item={it}
        on:edit={(e) =>
          alert("Employee edit only: switch to Employee view to edit.")}
      />
    {/each}
  </div>
</section>

<style>
  .page-container {
    padding: 1.25rem;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
  }
  .clear-btn {
    padding: 0.4rem 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
  }
  .clear-btn:hover {
    background: #f5f5f5;
  }
  .filter-info {
    color: #666;
    margin-bottom: 0.8rem;
    font-size: 0.95rem;
  }
  .filter-info strong {
    color: #333;
  }
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .controls .left {
    display: flex;
    gap: 0.75rem;
  }
  label {
    font-size: 0.95rem;
  }
  select,
  input {
    margin-left: 0.4rem;
    padding: 0.35rem 0.5rem;
  }
  .inline {
    display: flex;
    align-items: center;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .empty {
    color: #666;
    padding: 2rem;
    grid-column: 1/-1;
    text-align: center;
  }

  @media (max-width: 900px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 600px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .controls {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
