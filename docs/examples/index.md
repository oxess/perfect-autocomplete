# Basic Examples

## Simple Search

The most basic usage with default settings:

```html
<input type="search" id="search" placeholder="Search..." />
<perfect-autocomplete
  for="search"
  url="/api/search"
></perfect-autocomplete>
```

## With Configuration

Customized behavior:

```html
<input type="search" id="user-search" placeholder="Find a user..." />
<perfect-autocomplete
  for="user-search"
  url="/api/users"
  query-param="name"
  min-chars="1"
  debounce="250"
  max-items="8"
  placement="bottom-start"
></perfect-autocomplete>
```

## Handling Selection

```html
<input type="search" id="product-search" />
<perfect-autocomplete
  for="product-search"
  url="/api/products"
></perfect-autocomplete>

<script type="module">
import { register } from 'perfect-autocomplete'
register()

const autocomplete = document.querySelector('perfect-autocomplete')

autocomplete.addEventListener('pac:select', (e) => {
  const { item } = e.detail

  // Navigate to product page
  window.location.href = `/products/${item.id}`
})
</script>
```

## Form Integration

```html
<form action="/search" method="GET">
  <label for="query">Search</label>
  <input type="search" id="query" name="q" />
  <perfect-autocomplete
    for="query"
    url="/api/suggestions"
    close-on-select
  ></perfect-autocomplete>
  <button type="submit">Search</button>
</form>

<script type="module">
import { register } from 'perfect-autocomplete'
register()

const autocomplete = document.querySelector('perfect-autocomplete')
const form = document.querySelector('form')

autocomplete.addEventListener('pac:select', (e) => {
  // Optionally submit form on selection
  // form.submit()
})
</script>
```

## Multiple Instances

Each instance works independently:

```html
<div class="search-container">
  <input type="search" id="city-search" placeholder="City..." />
  <perfect-autocomplete
    for="city-search"
    url="/api/cities"
  ></perfect-autocomplete>
</div>

<div class="search-container">
  <input type="search" id="country-search" placeholder="Country..." />
  <perfect-autocomplete
    for="country-search"
    url="/api/countries"
  ></perfect-autocomplete>
</div>
```

## Dark Mode

Using CSS custom properties:

```html
<style>
  .dark perfect-autocomplete {
    --pac-bg-color: #1f2937;
    --pac-text-color: #f9fafb;
    --pac-border-color: #374151;
    --pac-highlight-bg: #374151;
  }
</style>

<div class="dark">
  <input type="search" id="dark-search" />
  <perfect-autocomplete
    for="dark-search"
    url="/api/search"
  ></perfect-autocomplete>
</div>
```

## Loading States

Monitor loading state for custom UI:

```html
<div class="search-wrapper">
  <input type="search" id="async-search" />
  <span class="loading-indicator" hidden>Loading...</span>
  <perfect-autocomplete
    for="async-search"
    url="/api/search"
  ></perfect-autocomplete>
</div>

<script type="module">
import { register } from 'perfect-autocomplete'
register()

const autocomplete = document.querySelector('perfect-autocomplete')
const indicator = document.querySelector('.loading-indicator')

// Show/hide loading indicator
setInterval(() => {
  indicator.hidden = !autocomplete.isLoading
}, 100)
</script>
```

## Error Handling

```html
<input type="search" id="error-search" />
<div class="error-message" hidden></div>
<perfect-autocomplete
  for="error-search"
  url="/api/search"
></perfect-autocomplete>

<script type="module">
import { register } from 'perfect-autocomplete'
register()

const autocomplete = document.querySelector('perfect-autocomplete')
const errorDiv = document.querySelector('.error-message')

autocomplete.addEventListener('pac:error', (e) => {
  errorDiv.textContent = `Error: ${e.detail.error.message}`
  errorDiv.hidden = false
})

autocomplete.addEventListener('pac:items-loaded', () => {
  errorDiv.hidden = true
})
</script>
```
