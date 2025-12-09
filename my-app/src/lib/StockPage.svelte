<script>
  import {
    filteredItems,
    selectedCategory,
    selectedCategoryDisplayName,
    searchQuery,
    categoryHash,
    employee,

    items

  } from "./stores.js";
  import ItemCard from "./ItemCard.svelte";
  import { onMount } from "svelte";

  let category = "all";
  let sortBy = "name-asc";
  let query = "";
  // base comes from global filteredItems (header search and category filter applied)
  let base = [];
  const unsubscribe = filteredItems.subscribe((v) => (base = v));

  // Sync local category dropdown with selectedCategory from URL
  const unsubCategory = selectedCategory.subscribe((cat) => {
    if (cat) {
      category = cat;
    } else {
      category = "all";
    }
  });

  $: filtered = base
    .filter((i) => true)
    .slice()
    .sort((a, b) => {
      if (sortBy === "category") return a.category.localeCompare(b.category);
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "qty-asc") return (a.quantity ?? 0) - (b.quantity ?? 0);
      if (sortBy === "qty-desc") return (b.quantity ?? 0) - (a.quantity ?? 0);
      return 0;
    });

  $: canEdit = $employee;

  function handleEdit(event) {
    const item = event.detail.item;
    if (canEdit) {
      // Route to item detail page
      window.location.hash = `#/item/${item.id}`;
    } else {
      alert("Employee edit only: switch to Employee view to edit.");
    }
  }
  
  function handleDelete(event) {
    if (canEdit) {
      const id = event.detail.id;
      if (confirm("Delete item?")) {
        items.update((all) => all.filter((it) => it.id !== id));
      }
    } else {
      alert("Employee edit only: switch to Employee view to delete.");
    }
  }

  function clearFilters() {
    selectedCategory.set("");
    searchQuery.set("");
    category = "all";
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
        <select bind:value={category} on:change={() => selectedCategory.set(category)}>
          {#each Object.keys(categoryHash) as catKey}
            <option value={catKey}>{categoryHash[catKey]}</option>
          {/each}
        </select>
      </label>
      <label
        >Sort
        <select bind:value={sortBy}>
          <option value="name-asc">Name (A–Z)</option>
          { #if category === 'all' }
          <option value="category">Category</option>
          { /if}
          <option value="qty-asc">Quantity (Low → High)</option>
          <option value="qty-desc">Quantity (High → Low)</option>
        </select>
      </label>
    </div>
  </div>

  <div class="grid">
    {#if filtered.length === 0}
      <div class="empty">No items found</div>
    {/if}
    {#each filtered as it (it.id)}
      <ItemCard
        item={it}
        on:edit={handleEdit}
        on:delete={handleDelete}
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
    background: #1f2937;
    cursor: pointer;
  }
  .clear-btn:hover {
    background: #f5f5f5;
    color: #1f2937;
    background: #ffd166;
    border-color: #ffd166;
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
