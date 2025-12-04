<script>
  export let image = '';      // path to image
  export let category = '';   // category display name
  export let route = '';      // route to navigate to on click

  // normalize to a hash-style href
  $: href = route && route.startsWith('#') ? route : ('#' + (route || ''));
  $: bg = `url("${image}")`;
</script>

<a class="category-card" href={href}>
  <div class="image" style="background-image: {bg}"></div>
  <div class="name">
    <h3>{category}</h3>
  </div>
</a>

<style>
    .category-card {
        display: block;
        width: 320px;
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
        color: inherit;
        background: #fff;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .image {
        height: 180px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
    .name {
        padding: 0.6rem;
        text-align: center;
    }
    .name h3 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
    }
</style>