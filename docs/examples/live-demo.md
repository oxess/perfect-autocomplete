# Live Demo

Interactive examples with mock data. Try them out to see how Perfect Autocomplete works.

## Theme Showcase

Switch between the 5 built-in themes to see how they look. Each theme has its own unique style while maintaining full functionality.

<ThemeSwitcher />

## Basic User Search

A simple autocomplete for searching users. The component fetches data, displays suggestions, and handles selection.

<LiveDemo
  title="Search for a user"
  data-type="users"
/>

## Product Search with Custom Rendering

This demo shows custom item rendering with product information including category and price.

<LiveDemo
  title="Search products"
  data-type="products"
  :custom-render="true"
/>

## City Search

Search through cities with population data.

<LiveDemo
  title="Search cities"
  data-type="cities"
  :show-events="false"
/>

## How It Works

These demos use mock data that simulates real API responses. The component:

1. **Debounces** input to avoid excessive requests
2. **Fetches** data from the mock API endpoint
3. **Displays** results in a dropdown
4. **Handles** keyboard navigation (↑↓ arrows, Enter, Escape)
5. **Emits** events for all interactions

### Mock Data Structure

```typescript
// User data format
{
  id: 1,
  label: 'Alice Johnson',
  value: 'alice',
  email: 'alice@example.com',
  role: 'Developer'
}

// Product data format
{
  id: 1,
  label: 'MacBook Pro 16"',
  value: 'macbook-pro',
  category: 'Laptops',
  price: 2499
}

// City data format
{
  id: 1,
  label: 'New York',
  value: 'new-york',
  country: 'United States',
  population: 8336817
}
```

### Try These Searches

**Users:** Try typing "alice", "bob", "dev" (for developers), or "design" (for designers)

**Products:** Try typing "mac", "iphone", "air", or "pro"

**Cities:** Try typing "new", "london", "paris", or "tokyo"

## Keyboard Navigation

All demos support full keyboard navigation:

| Key | Action |
|-----|--------|
| `↓` | Move to next item |
| `↑` | Move to previous item |
| `Enter` | Select highlighted item |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move focus |

## Event System

The event log in each demo shows real-time events:

- **pac:open** - Dropdown opened
- **pac:close** - Dropdown closed
- **pac:select** - Item selected (with item data)
- **pac:items-loaded** - Search results loaded (with count and query)
- **pac:error** - Error occurred during fetch
