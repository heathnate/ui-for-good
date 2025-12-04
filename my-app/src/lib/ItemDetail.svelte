<script>
  import { itemsStore } from './stores.js'
  import { onDestroy } from 'svelte'
  export let id

  let items = []
  const unsub = itemsStore.subscribe((v) => (items = v))
  onDestroy(() => unsub())

  $: item = items.find((i) => String(i.id) === String(id))

  function goBack() {
    // go back to stock
    window.location.hash = '#/'
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
  .detail { background:#fff; padding:1rem; border-radius:8px }
</style>
