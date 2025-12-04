<script>
  import { items } from './stores.js';
  export let id;

  // find item by id (convert to string for comparison since URLs pass strings)
  $: item = $items.find((i) => String(i.id) === String(id));

  function goBack() {
    // go back to stock
    window.location.hash = '#/';
  }
</script>

{#if item}
  <article class="detail">
    <h2>{item.name}</h2>
    <p><strong>Category:</strong> {item.category}</p>
    <p><strong>Quantity:</strong> {item.quantity}</p>
    {#if item.notes}
      <p><strong>Notes:</strong> {item.notes}</p>
    {/if}
    <div style="margin-top:1rem">
      <button on:click={goBack}>Back to stock</button>
    </div>
  </article>
{:else}
  <p>Item not found.</p>
{/if}

<style>
  .detail { background:#fff; padding:1rem; border-radius:8px; }
  button { padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer; }
  button:hover { background: #f5f5f5; }
</style>
