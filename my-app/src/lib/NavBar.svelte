<script>
  import { globalSearchQuery, employee, searchFilteredItems, categoryHash } from "./stores.js";

  // local input model
  let q = "";
  let showDropdown = false;
  let inputEl;
  let pantryDetailsOpen = false;

  // sync local q with global store
  $: globalSearchQuery.set(q);

  // limited dropdown results
  $: results = $searchFilteredItems.slice(0, 6);

  $: isEmployee = $employee;

  function goTo(route) {
    window.location.hash = route;
    // clear search UI
    q = "";
    showDropdown = false;
  }

  function openItem(id) {
    goTo("#/item/" + id);
  }

  function togglePantryDetails() {
    pantryDetailsOpen = !pantryDetailsOpen;
  }

  function toggleEmployeeMode() {
    employee.update((e) => !e);
  }
</script>

<header class="nav">
  <div class="nav-inner">
    <div class="left">
      <h1 class="brand" on:click={() => goTo("#/")}>PantryPeeker</h1>
      <div
        class="pantry-name"
        on:click={togglePantryDetails}
        role="button"
        tabindex="0"
      >
        <div>Heath Community Pantry</div>
        <span class="arrow" class:open={pantryDetailsOpen}>▼</span>
      </div>
      {#if pantryDetailsOpen}
        <div class="pantry-details">
          <div>Pantry Details</div>
          <div>2600 Clifton Ave, Cincinnati, OH 45221</div>
          <div>Open: Mon-Fri 9am - 5pm</div>
          <div>(513) 556-6000</div>
        </div>
      {/if}
    </div>
    <div class="right">
        <div class="search">
        <input
          bind:this={inputEl}
          placeholder="Search items..."
          bind:value={q}
          on:input={() => (showDropdown = true)}
          on:focus={() => (showDropdown = true)}
        />

        {#if showDropdown}
          <ul
            class="search-dropdown"
            on:mouseleave={() => (showDropdown = false)}
          >
            {#each results as it}
              <li on:mousedown={() => openItem(it.id)}>
                {it.name} <small class="cat">{categoryHash[it.category]}</small>
              </li>
            {/each}
            {#if results.length === 0}
              <li class="empty">No results</li>
            {/if}
          </ul>
        {/if}
      </div>

      <nav class="actions">
        { #if isEmployee }
          <button on:click={() => goTo("#/add-item")}>Add Item</button>
          {/if}
        <button on:click={() => goTo("#/stock")}>View All Stock</button>
        <div class="employee-toggle">
          <label class="switch">
            <input type="checkbox" bind:checked={isEmployee} on:change={toggleEmployeeMode} />
            <span class="slider round"></span>
          </label>
          <p>Employee View</p>
        </div>
      </nav>

      
    </div>
  </div>
</header>

<style>
  .nav {
    background: linear-gradient(90deg, #1f2937, #111827);
    color: #fff;
    padding: 0.5rem 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  .nav-inner {
    margin: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
    position: relative;

    h1 {
        font-size: 1.5rem;
    }

  }
  .brand {
    font-size: 1.1rem;
    margin: 0;
    cursor: pointer;
  }
  .pantry-name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    transition: background 0.2s;
    margin-top: 0.2rem;
  }
  .pantry-name:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .arrow {
    font-size: 0.7em;
    transition: transform 0.2s;
  }
  .arrow.open {
    transform: rotate(180deg);
  }
  .pantry-details {
    position: absolute;
    top: 100%;
    left: 8.8rem;
    background: #2d3748;
    padding: 0.8rem 1rem;
    border-radius: 6px;
    margin-top: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    z-index: 100;
    font-size: 0.9rem;
    line-height: 1.6;
  }
  .pantry-details > div:first-child {
    font-weight: 600;
    margin-bottom: 0.4rem;
  }
  .actions {
    display: flex;
    align-items: center;
    flex-direction: row;

     .employee-toggle {
        margin-left: 1.5rem;
        display: flex;
        flex-direction: row;

        p {
          margin-left: 1.8rem;
        }
    } 

    .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
      transform: translate(18px, 18px);
    }

    /* Hide default HTML checkbox */
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(20px);
      -ms-transform: translateX(20px);
      transform: translateX(20px);
    }

    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }
  }
  .actions button {
    margin-left: 0.6rem;
    background: #fff;
    color: #1f2937;
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 0.45rem 0.8rem;
  }
  .actions button:hover {
    color: #111;
    background: #ffd166;
    border-color: #ffd166;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .search {
    position: relative;
  }
  .search input {
    padding: 0.45rem 0.6rem;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    min-width: 220px;
  }
  .search-dropdown {
    position: absolute;
    top: 110%;
    right: 0;
    left: 0;
    background: #fff;
    color: #111;
    border: 1px solid #ddd;
    border-radius: 6px;
    z-index: 50;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .search-dropdown li {
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
  }
  .search-dropdown li:hover {
    background: #f6f6f6;
  }
  .search-dropdown .cat {
    color: #666;
    font-size: 0.85em;
  }
  .search-dropdown .empty {
    color: #888;
    cursor: default;
  }
</style>
