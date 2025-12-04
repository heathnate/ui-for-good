<script>
  import { onMount } from 'svelte'
  import NavBar from './lib/NavBar.svelte'
  import StockPage from './lib/StockPage.svelte'
  import GreetingPage from './lib/GreetingPage.svelte';
  import EmployeeView from './lib/EmployeeView.svelte'
  import ItemDetail from './lib/ItemDetail.svelte'

  let route = '/'
  let params = {}

  function parseHash() {
    const h = (window.location.hash || '#/').replace(/^#/, '')
    if (h.startsWith('/item/')) {
      route = '/item'
      params.id = h.split('/')[2]
    } else if (h.startsWith('/employee')) {
      route = '/employee'
      params = {}
    } else {
      route = '/'
      params = {}
    }
  }

  onMount(() => {
    parseHash()
    window.addEventListener('hashchange', parseHash)
  })
</script>

<div id="app-root">
  <NavBar />

  <main class="container">
    {#if route === '/item'}
      <ItemDetail id={params.id} />
    {:else if route === '/employee'}
      <EmployeeView />
    {:else}
      <GreetingPage />
    {/if}
  </main>
</div>

<style>
  .container {
  }
</style>
