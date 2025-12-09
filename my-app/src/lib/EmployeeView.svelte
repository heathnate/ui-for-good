<script>
  import NewItemForm from "./NewItemForm.svelte";

  let showChoices = true;
  let showScanInterface = false;
  let showManualForm = false;
  let showScanAnimation = false;

  let mockItem = {
    name: "Green Beans",
    category: "canned",
    quantity: 10,
    notes: "Low sodium",
    image: "/items/green-beans.jpg"
  }

  let scannedItem = null;

  function showScan() {
    showChoices = false;
    showScanInterface = true;
  }

  function showManual() {
    showChoices = false;
    showManualForm = true;
    scannedItem = null;
  }

  function backToChoices() {
    showChoices = true;
    showScanInterface = false;
    showManualForm = false;
    showScanAnimation = false;
    scannedItem = null;
  }

  function scanItem() {
    // Show the scan animation
    showScanAnimation = true;
    showScanInterface = false;
    
    // After 4 seconds, show the form with scanned item data
    setTimeout(() => {
      showScanAnimation = false;
      showManualForm = true;
      scannedItem = { ...mockItem };
    }, 4000);
  }

</script>

<h2 class="header">Add Item</h2>

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
  <NewItemForm item={scannedItem || { name: "", category: "", quantity: 0, notes: "", image: "" }} scanned={!!scannedItem} on:back={backToChoices} />
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
</style>
