<script>
  import { createEventDispatcher } from "svelte";
  import { categoryHash } from "./stores.js";
  export let item;
  const dispatch = createEventDispatcher();

  $: displayCategory = categoryHash[item.category] || item.category; // Use the category name if possible instead of the id string

  let imagePath = "";

  // Load image (either from public folder or localStorage)
  $: loadItemImage(item.image);

  function loadItemImage(imageFile) {
    if (!imageFile) {
      return;
    }

    // Check if it's a custom uploaded image
    if (imageFile.startsWith("custom_")) {
      const stored = localStorage.getItem(`item_image_${imageFile}`);

      // If image is from local storage, use that
      if (stored) {
        imagePath = `url("${stored}")`;
      }
    } else {
      // Standard image from public folder
      imagePath = imageFile.trim().startsWith("/items/")
        ? `url("${imageFile.trim()}")`
        : `url("/items/${imageFile.trim()}")`;
    }
  }
</script>

<div
  class="card"
  role="button"
  tabindex="0"
  on:click={() => dispatch("view", { item })}
>
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
</div>

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
</style>
