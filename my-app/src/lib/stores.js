import { writable, derived } from "svelte/store";

const STORAGE_KEY = "pantry_items_v1";

const defaultItems = [
  {
    id: 1,
    name: "Canned Beans",
    category: "Canned Goods",
    quantity: 24,
    notes: "",
  },
  { id: 2, name: "Rice 1kg", category: "Grains", quantity: 10, notes: "" },
  { id: 3, name: "Peanut Butter", category: "Spreads", quantity: 5, notes: "" },
];

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load items from localStorage", e);
  }
  return defaultItems;
}

function save(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Failed to save items to localStorage", e);
  }
}

function createStore() {
  const { subscribe, set, update } = writable(load());

  subscribe((items) => save(items));

  return {
    subscribe,
    addItem: (item) =>
      update((list) => {
        const next = [{ ...item, id: Date.now() }, ...list];
        return next;
      }),
    updateItem: (item) =>
      update((list) =>
        list.map((i) => (i.id === item.id ? { ...i, ...item } : i))
      ),
    deleteItem: (id) => update((list) => list.filter((i) => i.id !== id)),
    clear: () => set([]),
  };
}

export const itemsStore = createStore();

export const categories = derived(itemsStore, ($items) => {
  const set = new Set($items.map((i) => i.category).filter(Boolean));
  return ["All", ...Array.from(set)];
});
