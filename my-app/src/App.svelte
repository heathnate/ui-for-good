<script>
  import { onMount } from "svelte";
  import NavBar from "./lib/NavBar.svelte";
  import StockPage from "./lib/StockPage.svelte";
  import GreetingPage from "./lib/GreetingPage.svelte";
  import ItemDetail from "./lib/ItemDetail.svelte";
  import {
    selectedCategory,
    globalSearchQuery,
    employee,
  } from "./lib/stores.js";
  import { get } from "svelte/store";
  import AddItem from "./lib/AddItem.svelte";

  let route = "/";
  let params = {};
  let accessDenied = false;

  // Used to parse URL and set route/params accordingly
  function parseHash() {
    const h = (window.location.hash || "#/").replace(/^#/, "");
    const isEmployee = get(employee);

    accessDenied = false;

    if (h.startsWith("/item/")) {
      route = "/item";
      params.id = h.split("/")[2];
      selectedCategory.set("");
    } else if (h.startsWith("/add-item")) {
      // Only employees can add items
      if (!isEmployee) {
        accessDenied = true;
        route = "/";
        selectedCategory.set("");
        globalSearchQuery.set("");
        return;
      }
      route = "/add-item";
      params = {};
      selectedCategory.set("");
    } else if (h.startsWith("/stock")) {
      route = "/stock";
      params = {};
      // Parse category from query string
      const queryMatch = h.match(/\?category=([^&]+)/);
      if (queryMatch) {
        selectedCategory.set(decodeURIComponent(queryMatch[1]));
      } else {
        selectedCategory.set("");
      }
    } else {
      route = "/";
      params = {};
      selectedCategory.set("");
      globalSearchQuery.set("");
    }
  }

  onMount(() => {
    parseHash();
    window.addEventListener("hashchange", parseHash);

    // Also listen for employee privilege changes
    const unsubscribe = employee.subscribe(() => {
      parseHash();
    });

    return unsubscribe;
  });
</script>

<div id="app-root">
  <NavBar />

  <main class="container">
    {#if accessDenied}
      <div class="access-denied">
        <h2>Access Denied</h2>
        <p>You must be logged in as an employee to access this page.</p>
        <p>Switch to Employee View in the navigation bar to continue.</p>
        <button on:click={() => (window.location.hash = "#/")}
          >Return to Home</button
        >
      </div>
    {:else if route === "/item"}
      <ItemDetail id={params.id} />
    {:else if route === "/add-item"}
      <AddItem />
    {:else if route === "/stock"}
      <StockPage />
    {:else}
      <GreetingPage />
    {/if}
  </main>
</div>

<style>
  .access-denied {
    max-width: 600px;
    margin: 3rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h2 {
      color: #dc2626;
      margin-top: 0;
    }

    p {
      color: #666;
      line-height: 1.6;
    }

    button {
      margin-top: 1.5rem;
      padding: 0.6rem 1.2rem;
      background: #1f2937;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
    }

    button:hover {
      background: #ffd166;
      color: #1f2937;
    }
  }
</style>
