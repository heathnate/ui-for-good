<script>
  import NavBar from './lib/NavBar.svelte'
  import StockPage from './lib/StockPage.svelte'
  import EmployeeView from './lib/EmployeeView.svelte'

  let view = 'stock' // 'stock' | 'employee'

  function setView(v) {
    view = v
  }
</script>

<div id="app-root">
  <NavBar {view} {setView} />

  <main class="container">
    {#if view === 'stock'}
      <StockPage />
    {:else}
      <EmployeeView />
    {/if}
  </main>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 1.5rem auto;
    padding: 1rem;
  }
</style>
