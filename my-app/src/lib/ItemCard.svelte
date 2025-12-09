<script>
  import { createEventDispatcher } from "svelte";
  import { categoryHash, employee } from "./stores.js";
  export let item;
  const dispatch = createEventDispatcher();

  $: displayCategory = categoryHash[item.category] || item.category;
  $: imagePath = `url("/items/${item.image}")`;
  $: canEdit = $employee;
</script>

<article class="card" role="button" tabindex="0">
  <div class="card-image" style="background-image: {imagePath}"></div>
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
  {#if canEdit}
    <div class="card-actions">
      <button on:click|stopPropagation={() => dispatch("edit", { item })}
        >Edit</button
      >
      <button class="delete" on:click|stopPropagation={() => dispatch("delete", { id: item.id })}
        >Delete
      </button>
    </div>
  {/if}
</article>

<style>
  .card {
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #fff;
    color: #111;
  }
  .card-image {
    height: 220px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  .item-name {
    margin: 0 0 0.4rem 0;
  }
  .meta {
    display: flex;
    gap: 0.6rem;
    font-size: 0.9rem;
    color: #555;
  }
  .notes {
    margin-top: 0.6rem;
    font-size: 0.9rem;
    color: #333;
  }
  .card-actions {
    margin-top: 0.8rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;

    button {
      padding: 0.4rem 0.6rem;
    }

    .delete {
        background: #b41a1a;
        color: #fff;
        border: none;
      }

    button:hover {
      background: #ffd166;
      border-color: #ffd166;
      color: #000;
    }
  }
</style>
