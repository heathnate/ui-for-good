<script>
  import { onMount } from 'svelte'
  import NavBar from './lib/NavBar.svelte'
  import StockPage from './lib/StockPage.svelte'
  import GreetingPage from './lib/GreetingPage.svelte';
  import EmployeeView from './lib/EmployeeView.svelte'
  import ItemDetail from './lib/ItemDetail.svelte'
  import { selectedCategory, globalSearchQuery } from './lib/stores.js'

  let route = '/'
  let params = {}

  function parseHash() {
    const h = (window.location.hash || '#/').replace(/^#/, '')
    if (h.startsWith('/item/')) {
      route = '/item'
      params.id = h.split('/')[2]
      selectedCategory.set('')
    } else if (h.startsWith('/add-item')) {
      route = '/add-item'
      params = {}
      selectedCategory.set('')
    } else if (h.startsWith('/stock')) {
      route = '/stock'
      params = {}
      // Parse category from query string
      const queryMatch = h.match(/\?category=([^&]+)/)
      if (queryMatch) {
        selectedCategory.set(decodeURIComponent(queryMatch[1]))
      } else {
        selectedCategory.set('')
      }
    } else {
      route = '/'
      params = {}
      selectedCategory.set('')
      globalSearchQuery.set('')
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
    {:else if route === '/add-item'}
      <EmployeeView />
    {:else if route === '/stock'}
      <StockPage />
    {:else}
      <GreetingPage />
    {/if}
  </main>
</div>

<style>
</style>
