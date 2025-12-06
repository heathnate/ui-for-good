<script>
  import { itemsStore } from "./stores.js";
  import { onMount } from "svelte";

  let showChoices = true;
  let showScanInterface = false;
  let showManualForm = false;
  let showScanAnimation = false;

  let items = [];
  const unsub = itemsStore.subscribe((v) => (items = v));

  let editing = null;
  let form = { name: "", category: "", quantity: 0, notes: "" };

  function startAdd() {
    editing = null;
    form = { name: "", category: "", quantity: 0, notes: "" };
  }

  function startEdit(item) {
    editing = item.id;
    form = { ...item };
  }

  function save() {
    if (!form.name.trim()) return alert("Name required");
    form.quantity = Number(form.quantity) || 0;
    if (editing) {
      itemsStore.updateItem({ ...form, id: editing });
    } else {
      itemsStore.addItem(form);
    }
    startAdd();
  }

  function remove(id) {
    if (confirm("Delete item?")) itemsStore.deleteItem(id);
  }

  function showScan() {
    showChoices = false;
    showScanInterface = true;
  }

  function showManual() {
    showChoices = false;
    showManualForm = true;
  }

  function backToChoices() {
    showChoices = true;
    showScanInterface = false;
    showManualForm = false;
  }

  function scanItem() {
    // Show the scan animation
    showScanAnimation = true;
    
    // After 4 seconds, navigate back to greeting page
    setTimeout(() => {
      showScanAnimation = false;
      window.location.hash = '#/';
    }, 4000);
  }

  onMount(() => () => unsub());
</script>

<h2 class="header">Add Items</h2>

{#if showChoices}
<div class="initial-choices-container">
  <div class = "initial-choices">
    <button on:click={showScan}>Scan Item</button>
    <button on:click={showManual}>Add Item Manually</button>
  </div>
</div>
{/if}

{#if showScanInterface}
<div class="scan-menu-container">

  <div class="scan-menu">
    <h2>Scan Barcode</h2>
    <p>Note: The concept is that the employee would be able to physically scan the barcode of an item to add it.</p>
    <p>Right now the scanning is simulated to be a can of green beans.</p>
    <button on:click={backToChoices}>Back</button>
    <button on:click={scanItem}>Simulate Scan</button>
  </div>
</div>
{/if}

{#if showScanAnimation}
<div class="scan-animation-overlay">
  <div class="animation-container">
    <img src="/scan-barcode.gif" alt="Scanning barcode..." class="scan-gif" />
    <p>Scanning...</p>
  </div>
</div>
{/if}

{#if showManualForm}
<section class="employee">
  <div class="form">
    <h2>{editing ? "Edit Item" : "Add Item"}</h2>
    <label>Name<input bind:value={form.name} /></label>
    <label>Category<input bind:value={form.category} /></label>
    <label>Quantity<input type="number" bind:value={form.quantity} /></label>
    <label>Notes<textarea rows="2" bind:value={form.notes}></textarea></label>
    <div class="form-actions">
      <button on:click={save}>{editing ? "Save" : "Add"}</button>
      <button on:click={startAdd} class="muted">Cancel</button>
    </div>
  </div>

  <div class="list">
    <h2>Current Items</h2>
    {#if items.length === 0}
      <div class="empty">No items</div>
    {/if}
    <table>
      <thead><tr><th>Name</th><th>Category</th><th>Qty</th><th></th></tr></thead
      >
      <tbody>
        {#each items as it}
          <tr>
            <td>{it.name}</td>
            <td>{it.category}</td>
            <td>{it.quantity}</td>
            <td class="row-actions">
              <button on:click={() => startEdit(it)}>Edit</button>
              <button on:click={() => remove(it.id)} class="danger"
                >Delete</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <button on:click={backToChoices}>Back</button>
</section>
{/if}

<style>
  .header {
    margin-left: 1rem;
  }
  .initial-choices-container {
    position: relative;
    height: 70vh;
    width: 100vw;

    .initial-choices {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;

      button {
        margin: 0 1rem;
        padding: 1rem 2rem;
        font-size: 1.2rem;
        border-radius: 8px;
        border: 1px solid #ddd;
        background: #1f2937;
        cursor: pointer;
      }

      button:hover {
        background: #ffd166;
        border-color: #ffd166;
        color: #1f2937;
      }
    }

  }
  .scan-menu-container {
    position: relative;
    height: 70vh;
    width: 100vw;

    .scan-menu {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;

      button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #1f2937;
        cursor: pointer;
      }

      button:hover {
        background: #ffd166;
        border-color: #ffd166;
        color: #1f2937;
      }
    }
  }
  .scan-animation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .animation-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .scan-gif {
    width: 300px;
    height: 300px;
    background: #fff;
  }
  .animation-container p {
    color: #fff;
    font-size: 1.2rem;
    margin: 0;
  }
  .employee {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 1rem;
  }
  .form {
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
  }
  label {
    display: block;
    margin-bottom: 0.6rem;
  }
  input,
  textarea {
    width: 100%;
    padding: 0.45rem;
    margin-top: 0.25rem;
  }
  .form-actions {
    margin-top: 0.6rem;
    display: flex;
    gap: 0.5rem;
  }
  .muted {
    background: #f3f4f6;
  }
  .list {
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    text-align: left;
    padding: 0.6rem;
    border-bottom: 1px solid #eee;
  }
  .row-actions button {
    margin-left: 0.4rem;
  }
  .danger {
    background: #ffdddd;
  }
  @media (max-width: 900px) {
    .employee {
      grid-template-columns: 1fr;
    }
  }
</style>
