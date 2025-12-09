<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { categoryHash, employee } from "./stores.js";
  export let item;
  const dispatch = createEventDispatcher();

  $: displayCategory = categoryHash[item.category] || item.category;
  $: canEdit = $employee;
  
  let imagePath = "";
  
  // Load image (either from public folder or localStorage)
  $: loadItemImage(item.image);
  
  function loadItemImage(imageFile) {
    if (!imageFile) {
      imagePath = "url('/items/placeholder.jpg')";
      return;
    }
    
    // Check if it's a custom uploaded image
    if (imageFile.startsWith('custom_')) {
      const stored = localStorage.getItem(`item_image_${imageFile}`);
      if (stored) {
        imagePath = `url("${stored}")`;
      } else {
        imagePath = "url('/items/placeholder.jpg')";
      }
    } else {
      // Standard image from public folder
      imagePath = imageFile.trim().startsWith('/items/') ? `url("${imageFile.trim()}")` : `url("/items/${imageFile.trim()}")`;
    }
  }
</script>

<article class="card" role="button" tabindex="0" on:click={() => dispatch("view", { item })}>
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
    cursor: pointer;
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
