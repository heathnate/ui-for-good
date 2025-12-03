<script>
  import { itemsStore } from './stores.js'
  import { onMount } from 'svelte'

  let items = []
  const unsub = itemsStore.subscribe((v) => (items = v))

  let editing = null
  let form = { name: '', category: '', quantity: 0, notes: '' }

  function startAdd() {
    editing = null
    form = { name: '', category: '', quantity: 0, notes: '' }
  }

  function startEdit(item) {
    editing = item.id
    form = { ...item }
  }

  function save() {
    if (!form.name.trim()) return alert('Name required')
    form.quantity = Number(form.quantity) || 0
    if (editing) {
      itemsStore.updateItem({ ...form, id: editing })
    } else {
      itemsStore.addItem(form)
    }
    startAdd()
  }

  function remove(id) {
    if (confirm('Delete item?')) itemsStore.deleteItem(id)
  }

  onMount(() => () => unsub())
</script>

<section class="employee">
  <div class="form">
    <h2>{editing ? 'Edit Item' : 'Add Item'}</h2>
    <label>Name<input bind:value={form.name} /></label>
    <label>Category<input bind:value={form.category} /></label>
    <label>Quantity<input type="number" bind:value={form.quantity} /></label>
    <label>Notes<textarea rows="2" bind:value={form.notes}></textarea></label>
    <div class="form-actions">
      <button on:click={save}>{editing ? 'Save' : 'Add'}</button>
      <button on:click={startAdd} class="muted">Cancel</button>
    </div>
  </div>

  <div class="list">
    <h2>Current Items</h2>
    {#if items.length === 0}
      <div class="empty">No items</div>
    {/if}
    <table>
      <thead><tr><th>Name</th><th>Category</th><th>Qty</th><th></th></tr></thead>
      <tbody>
        {#each items as it}
          <tr>
            <td>{it.name}</td>
            <td>{it.category}</td>
            <td>{it.quantity}</td>
            <td class="row-actions">
              <button on:click={() => startEdit(it)}>Edit</button>
              <button on:click={() => remove(it.id)} class="danger">Delete</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<style>
  .employee { display:grid; grid-template-columns: 360px 1fr; gap:1rem }
  .form { background:#fff; padding:1rem; border-radius:8px }
  label { display:block; margin-bottom:0.6rem }
  input, textarea { width:100%; padding:0.45rem; margin-top:0.25rem }
  .form-actions { margin-top:0.6rem; display:flex; gap:0.5rem }
  .muted { background:#f3f4f6 }
  .list { background:#fff; padding:1rem; border-radius:8px }
  table { width:100%; border-collapse:collapse }
  th, td { text-align:left; padding:0.6rem; border-bottom:1px solid #eee }
  .row-actions button { margin-left:0.4rem }
  .danger { background:#ffdddd }
  @media (max-width:900px){ .employee{grid-template-columns:1fr} }
</style>
