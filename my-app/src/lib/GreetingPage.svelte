<script>
  // Greeting page with welcome banner and category cards

  import CategoryCard from "./CategoryCard.svelte";

  const categories = [
    {
      image: "/produce.jpg",
      category: "Produce",
      route: "/stock?category=produce",
    },
    { image: "/meat.jpg", category: "Meat", route: "/stock?category=meat" },
    { image: "/dairy.jpg", category: "Dairy", route: "/stock?category=dairy" },
    {
      image: "/canned.jpg",
      category: "Canned Goods",
      route: "/stock?category=canned",
    },
    {
      image: "/grains.jpg",
      category: "Grains & Pasta",
      route: "/stock?category=grains",
    },
    {
      image: "/bakery.jpg",
      category: "Bakery",
      route: "/stock?category=bakery",
    },
    {
      image: "/frozen.jpg",
      category: "Frozen Foods",
      route: "/stock?category=frozen",
    },
    {
      image: "/beverages.jpg",
      category: "Beverages",
      route: "/stock?category=beverages",
    },
    {
      image: "/personal-care.jpg",
      category: "Personal Care",
      route: "/stock?category=personal-care",
    },
    {
      image: "/household.jpg",
      category: "Household Supplies",
      route: "/stock?category=household",
    },
    {
      image: "/baby.jpg",
      category: "Baby Products",
      route: "/stock?category=baby",
    },
    {
      image: "/pets.jpg",
      category: "Pet Supplies",
      route: "/stock?category=pets",
    },
  ];
</script>

<div class="welcome-banner-container">
  <img
    src="/banner.jpeg"
    alt="Welcome to PantryPeeker!"
    class="welcome-banner-image"
  />
  <div class="welcome-text">
    <p class="main-text">Welcome to</p>
    <p class="main-text">PantryPeeker!</p>
    <p class="subtext">Know what's on the shelf before you go.</p>
  </div>
</div>

<section class="categories-section">
  <h2 class="browse-text">Browse by category</h2>
  <div class="categories-grid">
    {#each categories as c}
      <CategoryCard image={c.image} category={c.category} route={c.route} />
    {/each}
  </div>
</section>

<style>
  .welcome-banner-container {
    position: relative;
    width: 100%;
    max-height: 420px;
    border-bottom: #333 4px solid;

    .welcome-banner-image {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.5;
      object-fit: cover;
      width: 100%;
      height: 100%;
      filter: brightness(0.6) blur(3px);
    }

    .welcome-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #333;
      opacity: 1;
      position: relative;

      .main-text {
        font-size: 5.5rem;
        font-weight: bold;
        padding: 0;
        margin: 0;
      }

      .subtext {
        font-size: 1.8rem;
        font-weight: normal;
      }
    }
  }

  .browse-text {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.7rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .categories-section {
    padding: 1.2rem;
  }

  .categories-grid {
    display: grid;
    place-items: center;
    gap: 2rem;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
</style>
