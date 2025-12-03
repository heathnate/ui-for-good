<script>
  export let view = 'stock'
  export let setView = (view) => {}
</script>

<header class="nav">
  <div class="nav-inner">
    <h1 class="brand">Food Pantry — Stock Viewer</h1>
    <nav class="actions">
      <button class:active={view === 'stock'} on:click={() => setView('stock')}>Stock</button>
      <button class:active={view === 'employee'} on:click={() => setView('employee')}>Employee</button>
    </nav>
  </div>
</header>

<style>
  .nav {
    background: linear-gradient(90deg, #1f2937, #111827);
    color: #fff;
    padding: 0.5rem 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand {
    font-size: 1.1rem;
    margin: 0;
  }
  .actions button {
    margin-left: 0.6rem;
    background: transparent;
    color: #ddd;
    border: 1px solid rgba(255,255,255,0.06);
    padding: 0.45rem 0.8rem;
  }
  .actions button.active,
  .actions button:hover {
    color: #111;
    background: #ffd166;
    border-color: #ffd166;
  }
</style>
