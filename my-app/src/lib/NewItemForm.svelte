<script>
  import { createEventDispatcher } from 'svelte';
  import { itemsStore, categoryHash } from './stores.js';
  
  const dispatch = createEventDispatcher();

  export let item = {
    name: "",
    category: "",
    quantity: 0,
    notes: "",
    image: ""
  };
  export let scanned = false;

  let fileInput;
  let previewUrl = item.image ?? "";

  console.log('Initial item image:', item.image, previewUrl);

  function save() {
    if (!item.name.trim()) {
      alert("Name is required");
      return;
    }
    item.quantity = Number(item.quantity) || 0;
    itemsStore.addItem(item);
    alert("Item added successfully!");
    dispatch('back');
  }

  function backToChoices() {
    dispatch('back');
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl = String(e.target.result);
        item.image = file.name;
      };
      reader.readAsDataURL(file);
    }
  }

  function triggerFileInput() {
    fileInput.click();
  }

  function removeImage() {
    previewUrl = "";
    item.image = "";
    if (fileInput) fileInput.value = "";
  }
</script>

<section class="form-container">
  <div class="form">
    <h2>{scanned ? "Review Scanned Item" : "Add New Item"}</h2>
    {#if scanned}
      <p class="info">Make any necessary edits to the scanned item below.</p>
    {:else}
      <p class="info">Enter the details for the new item.</p>
    {/if}
    
    <label>Name<input bind:value={item.name} required /></label>
    
    <label>
      Category
      <select bind:value={item.category}>
        <option value="">Select a category</option>
        {#each Object.entries(categoryHash) as [key, value]}
          {#if key !== 'all'}
            <option value={key}>{value}</option>
          {/if}
        {/each}
      </select>
    </label>
    
    <label>Quantity<input type="number" bind:value={item.quantity} min="0" /></label>
    <label>Notes<textarea rows="3" bind:value={item.notes}></textarea></label>
    
    <div class="form-actions">
      <button on:click={save} class="primary">Save Item</button>
      <button on:click={backToChoices} class="secondary">Back</button>
    </div>
  </div>

  <div class="image-section">
    <h2>Item Image</h2>
    <div class="image-container">
      {#if previewUrl}
        <img src={previewUrl} alt="Item preview" class="preview-image" />
        <button on:click={removeImage} class="remove-btn">Remove Image</button>
      {:else}
        <div class="no-image">
          <p>No image available</p>
          <button on:click={triggerFileInput} class="upload-btn">Upload Image</button>
        </div>
      {/if}
    </div>
    
    {#if previewUrl}
      <button on:click={triggerFileInput} class="change-btn">Change Image</button>
    {/if}
    
    <input
      type="file"
      bind:this={fileInput}
      on:change={handleFileSelect}
      accept="image/*"
      style="display: none;"
    />
  </div>
</section>

<style>
  .form-container {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  .form, .image-section {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .form h2, .image-section h2 {
    margin-top: 0;
  }
  .info {
    color: #666;
    margin-bottom: 1.5rem;
  }
  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 500;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
  }
  .form-actions {
    margin-top: 1.5rem;
    display: flex;
    gap: 0.75rem;
  }
  .primary {
    background: #1f2937;
    color: #fff;
    flex: 1;
  }
  .primary:hover {
    background: #ffd166;
    border-color: #ffd166;
    color: #1f2937;
  }
  .secondary {
    background: #f3f4f6;
    color: #333;
  }
  .secondary:hover {
    background: #e5e7eb;
  }

  .image-container {
    border: 2px dashed #ddd;
    border-radius: 8px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    position: relative;
    overflow: hidden;
  }
  .preview-image {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
  }
  .no-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: #666;
  }
  .upload-btn, .change-btn, .remove-btn {
    background: #1f2937;
    color: #fff;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .upload-btn:hover, .change-btn:hover {
    background: #ffd166;
    color: #1f2937;
  }
  .remove-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #dc2626;
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
  }
  .remove-btn:hover {
    background: #b91c1c;
  }
  .change-btn {
    width: 100%;
  }

  @media (max-width: 900px) {
    .form-container {
      flex-direction: column;
      align-items: center;
    }
  }
</style>