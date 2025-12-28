# Templates

Perfect Autocomplete uses [htm](https://github.com/developit/htm) for flexible, type-safe templating. You can customize how items are rendered using either JavaScript or declarative approaches.

## Default Template

By default, items are rendered with support for `label`, `image`, and `description`:

```javascript
// Default rendering structure
{
  label: "John Doe",           // Required
  image: "/avatar.jpg",        // Optional
  description: "Engineer"      // Optional
}
```

## JavaScript API

### renderItem Function

Set a custom render function for full control:

```javascript
const autocomplete = document.querySelector('perfect-autocomplete')

autocomplete.renderItem = (item, html, { highlighted, index }) => {
  return html`
    <div class="my-item ${highlighted ? 'active' : ''}">
      <img src=${item.avatar} alt="" />
      <div>
        <strong>${item.name}</strong>
        <small>${item.email}</small>
      </div>
    </div>
  `
}
```

### Template Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `item` | `AutocompleteItem` | The item data to render |
| `html` | `HtmlTemplateFunction` | The htm template function |
| `context.highlighted` | `boolean` | Whether the item is highlighted |
| `context.index` | `number` | The item's index in the list |

## htm Syntax

htm provides JSX-like syntax in template literals:

### Basic Elements

```javascript
html`<div class="container">Content</div>`
```

### Dynamic Values

```javascript
html`<span>${item.name}</span>`
```

### Conditional Rendering

```javascript
html`
  ${item.image && html`<img src=${item.image} />`}
`
```

### Lists

```javascript
html`
  <ul>
    ${items.map(item => html`<li>${item.name}</li>`)}
  </ul>
`
```

### Event Handlers

```javascript
html`<button onclick=${() => console.log('clicked')}>Click</button>`
```

## Examples

### User Card

```javascript
autocomplete.renderItem = (item, html, { highlighted }) => html`
  <div class="user-card ${highlighted ? 'selected' : ''}">
    <img
      class="avatar"
      src=${item.avatar || '/default-avatar.png'}
      alt=${item.name}
    />
    <div class="user-info">
      <span class="name">${item.name}</span>
      <span class="email">${item.email}</span>
    </div>
    ${item.verified && html`
      <span class="badge">✓</span>
    `}
  </div>
`
```

### Product Item

```javascript
autocomplete.renderItem = (item, html, { highlighted }) => html`
  <div class="product ${highlighted ? 'highlighted' : ''}">
    <img src=${item.thumbnail} alt=${item.name} />
    <div class="details">
      <span class="name">${item.name}</span>
      <span class="price">$${item.price.toFixed(2)}</span>
    </div>
    ${item.inStock
      ? html`<span class="stock in">In Stock</span>`
      : html`<span class="stock out">Out of Stock</span>`
    }
  </div>
`
```

### Search Result with Highlight

```javascript
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

autocomplete.renderItem = (item, html, context) => html`
  <div class="search-result">
    <span
      class="title"
      dangerouslySetInnerHTML=${{ __html: highlightMatch(item.title, query) }}
    />
    <span class="category">${item.category}</span>
  </div>
`
```

## Styling Custom Templates

Add CSS for your custom templates:

```css
/* User card styles */
.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
}

.user-card.selected {
  background: var(--pac-highlight-bg);
}

.user-card .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-card .name {
  font-weight: 600;
}

.user-card .email {
  font-size: 12px;
  color: #666;
}
```

## TypeScript Support

Templates are fully typed:

```typescript
import type { RenderItemFunction, AutocompleteItem } from '@mikolaj.jeziorny/perfect-autocomplete'

interface UserItem extends AutocompleteItem {
  avatar: string
  email: string
  verified: boolean
}

const renderUser: RenderItemFunction = (item, html, context) => {
  const user = item as UserItem
  return html`
    <div class="user">
      <img src=${user.avatar} />
      <span>${user.label}</span>
    </div>
  `
}

autocomplete.renderItem = renderUser
```
