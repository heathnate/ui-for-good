import { writable, derived } from "svelte/store";
import { defaultItems } from "./sample-data.js";

const STORAGE_KEY = "pantry_items_v1";

export let canEdit = false;

export const categoryHash = {
  all: "All",
  produce: "Produce",
  meat: "Meat",
  dairy: "Dairy",
  canned: "Canned Goods",
  grains: "Grains & Pasta",
  bakery: "Bakery",
  frozen: "Frozen Foods",
  beverages: "Beverages",
  "personal-care": "Personal Care",
  household: "Household Supplies",
  baby: "Baby Products",
  pets: "Pet Supplies",
};

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
  console.log("Derived categories:", set);
  return ["All", ...Array.from(set)];
});

export const items = writable(defaultItems);

// Global search query (header search)
export const searchQuery = writable("");

// Global selected category filter
export const selectedCategory = writable("");

export const selectedCategoryDisplayName = derived(
  [selectedCategory],
  ([$selectedCategory]) => {
    return categoryHash[$selectedCategory];
  }
);

// Derived filtered items used across the site (search applies to name, notes, category)
export const filteredItems = derived(
  [items, searchQuery, selectedCategory],
  ([$items, $search, $category]) => {
    let filtered = $items;

    // Filter by category first
    const cat = ($category || "").toString().trim().toLowerCase();
    if (cat && cat !== "all") {
      // Match against the lowercase category key in the data
      filtered = filtered.filter(
        (i) => (i.category || "").toLowerCase() === cat
      );
    }

    // Then filter by search query
    const q = ($search || "").toString().trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((i) =>
        (i.name + " " + (i.notes || "")).toLowerCase().includes(q)
      );
    }

    return filtered;
  }
);
