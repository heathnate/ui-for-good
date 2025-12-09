import { writable, derived, get } from "svelte/store";
import { defaultItems } from "./sample-data.js";

export const employee = writable(false);

// Map category ids to display names
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

export const items = writable(defaultItems); // Items store

// Get new unique id for new items
export function getNewId() {
  // return largest id from data + 1
  const itemsCopy = get(items);
  let maxId = itemsCopy.reduce(
    (max, item) => (item.id > max ? item.id : max),
    0
  );
  return maxId + 1;
}

// Global search query (nav bar search)
export const globalSearchQuery = writable("");

// Local search query (stock page search)
export const localSearchQuery = writable("");

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
  [items, localSearchQuery, selectedCategory],
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

// Don't filter by category here since this is global (nav bar)
export const searchFilteredItems = derived(
  [items, globalSearchQuery],
  ([$items, $search]) => {
    let filtered = $items;

    // Filter by search query
    const q = ($search || "").toString().trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((i) =>
        (i.name + " " + (i.notes || "")).toLowerCase().includes(q)
      );
    }

    return filtered;
  }
);
