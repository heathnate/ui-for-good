<script>
  import { itemsStore, categories } from './stores.js'
  import ItemCard from './ItemCard.svelte'
  import { onMount } from 'svelte'

  let category = 'All'
  let query = ''
  let onlyAvailable = false

  let items = []
  const unsubscribe = itemsStore.subscribe((v) => (items = v))

  $: filtered = items
    .filter((i) => (category === 'All' ? true : i.category === category))
    .filter((i) => (onlyAvailable ? i.quantity > 0 : true))
    .filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))

  onMount(() => {
    return () => unsubscribe()
  })
</script>

<section>
  <div class="controls">
    <div class="left">
      <label>Category
        <select bind:value={category}>
          {#each $categories as c}
            <option value={c}>{c}</option>
          {/each}
        </select>
      </label>
      <label>Search
        <input placeholder="Search items" bind:value={query} />
      </label>
    </div>
    <div class="right">
      <label class="inline"><input type="checkbox" bind:checked={onlyAvailable} /> Only available</label>
    </div>
  </div>

  <div class="grid">
    {#if filtered.length === 0}
      <div class="empty">No items found</div>
    {/if}
    {#each filtered as it (it.id)}
      <ItemCard item={it} on:edit={(e) => alert('Employee edit only: switch to Employee view to edit.') } />
    {/each}
  </div>
</section>

<style>
  .controls { display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:1rem }
  .controls .left { display:flex; gap:0.75rem }
  label { font-size:0.95rem }
  select, input { margin-left:0.4rem; padding:0.35rem 0.5rem }
  .inline { display:flex; align-items:center }
  .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:1rem }
  .empty { color:#666; padding:2rem; grid-column:1/-1; text-align:center }

  @media (max-width: 900px) {
    .grid { grid-template-columns: repeat(2, 1fr) }
  }
  @media (max-width: 600px) {
    .grid { grid-template-columns: 1fr }
    .controls { flex-direction:column; align-items:stretch }
  }
</style>
