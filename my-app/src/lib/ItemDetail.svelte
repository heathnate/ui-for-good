<script>
  import { items, categoryHash, employee } from './stores.js';
  export let id;

  let editing = false;
  let fileInput;
  let previewUrl = "";
  let imageData = null;
  
  // find item by id
  $: item = $items.find((i) => String(i.id) === String(id));
  
  // Create editable copy
  let editForm = { name: "", category: "", quantity: 0, notes: "", image: "" };
  
  // Load item data into form when item changes
  $: if (item && !editing) {
    editForm = { ...item };
    loadItemImage(item.image);
  }

  function loadItemImage(imageFile) {
    if (!imageFile) {
      previewUrl = "";
      return;
    }
    
    // Check if it's a custom uploaded image
    if (imageFile.startsWith('custom_')) {
      const stored = localStorage.getItem(`item_image_${imageFile}`);
      if (stored) {
        previewUrl = stored;
        imageData = stored;
      } else {
        previewUrl = "";
      }
    } else {
      // Standard image from public folder
      previewUrl = imageFile.trim().startsWith('/items/') ? imageFile.trim() : `/items/${imageFile.trim()}`;
    }
  }

  function startEdit() {
    editing = true;
    editForm = { ...item };
    loadItemImage(item.image);
  }

  function cancelEdit() {
    editing = false;
    editForm = { ...item };
    loadItemImage(item.image);
  }

  function saveChanges() {
    if (!editForm.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!editForm.category) {
      alert("Please select a category");
      return;
    }
    
    editForm.quantity = Number(editForm.quantity) || 0;
    
    // Handle image update
    let imageIdentifier = editForm.image;
    if (imageData && imageData.startsWith('data:')) {
      imageIdentifier = `custom_${Date.now()}.jpg`;
      try {
        localStorage.setItem(`item_image_${imageIdentifier}`, imageData);
      } catch (e) {
        console.warn('Failed to save image to localStorage:', e);
        alert('Warning: Image may be too large to save.');
      }
    }
    
    // Update the item in the store
    items.update((all) => {
      return all.map((it) => {
        if (String(it.id) === String(id)) {
          return { ...editForm, id: it.id, image: imageIdentifier };
        }
        return it;
      });
    });
    
    editing = false;
    alert("Item updated successfully!");
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 1024 * 1024) {
        alert('Image is too large. Please choose an image smaller than 1MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        imageData = String(e.target.result);
        previewUrl = imageData;
        editForm.image = file.name;
      };
      reader.readAsDataURL(file);
    }
  }

  function triggerFileInput() {
    fileInput.click();
  }

  function removeImage() {
    previewUrl = "";
    imageData = null;
    editForm.image = "";
    if (fileInput) fileInput.value = "";
  }

  function goBack() {
    window.location.hash = '#/stock';
  }

  function deleteItem() {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      items.update((all) => all.filter((it) => String(it.id) !== String(id)));
      alert("Item deleted successfully!");
      goBack();
    }
  }
</script>

{#if item}
  <section class="detail-container">
    {#if !editing}
      <!-- View Mode -->
      <div class="view-mode">
        <div class="header-row">
          <h2>{item.name}</h2>
          <div class="header-actions">
            <button on:click={startEdit} class="edit-btn">Edit Item</button>
            <button on:click={deleteItem} class="delete-btn">Delete</button>
          </div>
        </div>

        <div class="content-grid">
          <div class="image-section">
            <h3>Item Image</h3>
            <div class="image-display">
              {#if previewUrl}
                <img src={previewUrl} alt={item.name} class="item-image" />
              {:else}
                <div class="no-image-placeholder">
                  <p>No image available</p>
                </div>
              {/if}
            </div>
          </div>

          <div class="details-section">
            <h3>Item Details</h3>
            <div class="detail-row">
              <span class="label">Category:</span>
              <span class="value">{categoryHash[item.category] || item.category}</span>
            </div>
            <div class="detail-row">
              <span class="label">Quantity:</span>
              <span class="value">{item.quantity}</span>
            </div>
            {#if item.notes}
              <div class="detail-row">
                <span class="label">Notes:</span>
                <span class="value">{item.notes}</span>
              </div>
            {/if}
          </div>
        </div>

        <div class="actions-footer">
          <button on:click={goBack} class="back-btn">Back to Stock</button>
        </div>
      </div>
    {:else}
      <!-- Edit Mode -->
      <div class="edit-mode">
        <h2>Edit Item</h2>
        
        <div class="form-grid">
          <div class="form-section">
            <label>
              Name
              <input type="text" bind:value={editForm.name} required />
            </label>
            
            <label>
              Category
              <select bind:value={editForm.category}>
                <option value="">Select a category</option>
                {#each Object.entries(categoryHash) as [key, value]}
                  {#if key !== 'all'}
                    <option value={key}>{value}</option>
                  {/if}
                {/each}
              </select>
            </label>
            
            <label>
              Quantity
              <input type="number" bind:value={editForm.quantity} min="0" />
            </label>
            
            <label>
              Notes
              <textarea rows="4" bind:value={editForm.notes}></textarea>
            </label>
            
            <div class="form-actions">
              <button on:click={saveChanges} class="save-btn">Save Changes</button>
              <button on:click={cancelEdit} class="cancel-btn">Cancel</button>
            </div>
          </div>

          <div class="image-edit-section">
            <h3>Item Image</h3>
            <div class="image-container">
              {#if previewUrl}
                <img src={previewUrl} alt="Item preview" class="preview-image" />
                <button on:click={removeImage} class="remove-btn">Remove</button>
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
            <p class="hint">Recommended: Images under 1MB</p>
          </div>
        </div>
      </div>
    {/if}
  </section>
{:else}
  <div class="not-found">
    <h2>Item not found</h2>
    <p>The item you're looking for doesn't exist.</p>
    <button on:click={goBack}>Back to Stock</button>
  </div>
{/if}

<style>
  .detail-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  /* View Mode Styles */
  .view-mode {
    background: #fff;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
  }

  .header-row h2 {
    margin: 0;
    font-size: 2rem;
    color: #1f2937;
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .image-section, .details-section {
    background: #fafafa;
    padding: 1.5rem;
    border-radius: 8px;
  }

  .image-section h3, .details-section h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1f2937;
  }

  .image-display {
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
  }

  .item-image {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
  }

  .no-image-placeholder {
    color: #9ca3af;
    text-align: center;
  }

  .detail-row {
    display: flex;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-row .label {
    font-weight: 600;
    color: #4b5563;
    min-width: 120px;
  }

  .detail-row .value {
    color: #1f2937;
    flex: 1;
  }

  .actions-footer {
    display: flex;
    justify-content: flex-start;
    padding-top: 1rem;
  }

  /* Edit Mode Styles */
  .edit-mode {
    background: #fff;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .edit-mode h2 {
    margin-top: 0;
    margin-bottom: 2rem;
    color: #1f2937;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .form-section label {
    display: block;
    margin-bottom: 1.25rem;
    font-weight: 500;
    color: #374151;
  }

  .form-section input,
  .form-section textarea,
  .form-section select {
    width: 100%;
    padding: 0.6rem;
    margin-top: 0.4rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-family: inherit;
    font-size: 1rem;
  }

  .form-section input:focus,
  .form-section textarea:focus,
  .form-section select:focus {
    outline: none;
    border-color: #ffd166;
    box-shadow: 0 0 0 3px rgba(255, 209, 102, 0.1);
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .image-edit-section {
    background: #fafafa;
    padding: 1.5rem;
    border-radius: 8px;
  }

  .image-edit-section h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1f2937;
  }

  .image-container {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    position: relative;
    background: #fff;
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
    color: #6b7280;
  }

  .hint {
    color: #9ca3af;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    text-align: center;
  }

  /* Button Styles */
  button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .edit-btn {
    background: #1f2937;
    color: #fff;
  }

  .edit-btn:hover {
    background: #ffd166;
    color: #1f2937;
  }

  .delete-btn {
    background: #dc2626;
    color: #fff;
  }

  .delete-btn:hover {
    background: #b91c1c;
  }

  .save-btn {
    background: #1f2937;
    color: #fff;
    flex: 1;
  }

  .save-btn:hover {
    background: #ffd166;
    color: #1f2937;
  }

  .cancel-btn {
    background: #f3f4f6;
    color: #374151;
  }

  .cancel-btn:hover {
    background: #e5e7eb;
  }

  .back-btn {
    background: #f3f4f6;
    color: #374151;
  }

  .back-btn:hover {
    background: #e5e7eb;
  }

  .upload-btn, .change-btn {
    background: #1f2937;
    color: #fff;
    padding: 0.5rem 1rem;
  }

  .upload-btn:hover, .change-btn:hover {
    background: #ffd166;
    color: #1f2937;
  }

  .change-btn {
    width: 100%;
  }

  .remove-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #dc2626;
    color: #fff;
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
  }

  .remove-btn:hover {
    background: #b91c1c;
  }

  /* Not Found Styles */
  .not-found {
    max-width: 600px;
    margin: 3rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .not-found h2 {
    color: #dc2626;
    margin-top: 0;
  }

  .not-found p {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }

  /* Responsive Design */
  @media (max-width: 900px) {
    .content-grid,
    .form-grid {
      grid-template-columns: 1fr;
    }

    .header-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .header-actions {
      width: 100%;
    }

    .header-actions button {
      flex: 1;
    }
  }
</style>
