<script>
  import { createEventDispatcher } from 'svelte'
  import { categoryHash } from './stores.js'
  export let item
  const dispatch = createEventDispatcher()
  
  $: displayCategory = categoryHash[item.category] || item.category
</script>

<article class="card" role="button" tabindex="0" on:click={() => window.location.hash = '#/item/' + item.id}>
  <div class="card-body">
    <h3 class="item-name">{item.name}</h3>
    <div class="meta">
      <span class="category">{displayCategory}</span>
      <span class="qty">Qty: {item.quantity}</span>
    </div>
    {#if item.notes}
      <div class="notes">{item.notes}</div>
    {/if}
  </div>
  <div class="card-actions">
    <button on:click|stopPropagation={() => dispatch('edit', { item })}>Edit</button>
  </div>
</article>

<style>
  .card {
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.08);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #fff;
    color: #111;
  }
  .item-name { margin: 0 0 0.4rem 0 }
  .meta { display:flex; gap:0.6rem; font-size:0.9rem; color:#555 }
  .notes { margin-top:0.6rem; font-size:0.9rem; color:#333 }
  .card-actions { margin-top:0.8rem; display:flex; justify-content:flex-end }
  .card-actions button { padding:0.4rem 0.6rem }
</style>
