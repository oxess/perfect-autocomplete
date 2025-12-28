# Custom Templates

Examples of custom item rendering using the `renderItem` function.

## User Profiles

```javascript
autocomplete.renderItem = (user, html, { highlighted }) => html`
  <div class="user-profile ${highlighted ? 'highlighted' : ''}">
    <img
      class="avatar"
      src=${user.avatar || '/default-avatar.png'}
      alt=""
    />
    <div class="user-info">
      <span class="name">${user.name}</span>
      <span class="email">${user.email}</span>
      ${user.role && html`<span class="role">${user.role}</span>`}
    </div>
    ${user.online && html`<span class="status online">●</span>`}
  </div>
`
```

```css
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
}

.user-profile.highlighted {
  background: var(--pac-highlight-bg);
}

.user-profile .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-profile .user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-profile .name {
  font-weight: 600;
  color: var(--pac-text-color);
}

.user-profile .email {
  font-size: 12px;
  color: var(--pac-placeholder-color);
}

.user-profile .role {
  font-size: 11px;
  color: #3b82f6;
  background: #eff6ff;
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
  margin-top: 4px;
}

.user-profile .status.online {
  color: #22c55e;
  font-size: 10px;
}
```

## Product Cards

```javascript
autocomplete.renderItem = (product, html, { highlighted }) => html`
  <div class="product-card ${highlighted ? 'highlighted' : ''}">
    <img
      class="product-image"
      src=${product.thumbnail}
      alt=${product.name}
    />
    <div class="product-details">
      <span class="product-name">${product.name}</span>
      <span class="product-category">${product.category}</span>
      <div class="product-footer">
        <span class="product-price">$${product.price.toFixed(2)}</span>
        ${product.inStock
          ? html`<span class="stock in-stock">In Stock</span>`
          : html`<span class="stock out-of-stock">Out of Stock</span>`
        }
      </div>
    </div>
  </div>
`
```

## Location Search

```javascript
autocomplete.renderItem = (location, html, { highlighted }) => html`
  <div class="location-item ${highlighted ? 'highlighted' : ''}">
    <div class="location-icon">
      ${location.type === 'city' ? '🏙️' : location.type === 'airport' ? '✈️' : '📍'}
    </div>
    <div class="location-details">
      <span class="location-name">${location.name}</span>
      <span class="location-meta">
        ${location.country}
        ${location.code && html` · <code>${location.code}</code>`}
      </span>
    </div>
  </div>
`
```

## Search Results with Highlighting

```javascript
// Highlight matching text
function highlightMatch(text, query) {
  if (!query) return text
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi')
  const parts = text.split(regex)
  return parts.map(part =>
    part.toLowerCase() === query.toLowerCase()
      ? html`<mark>${part}</mark>`
      : part
  )
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

let currentQuery = ''

// Track query changes
autocomplete.addEventListener('pac:items-loaded', (e) => {
  currentQuery = e.detail.query
})

autocomplete.renderItem = (item, html, { highlighted }) => html`
  <div class="search-result ${highlighted ? 'highlighted' : ''}">
    <span class="result-title">${highlightMatch(item.title, currentQuery)}</span>
    <span class="result-snippet">${item.snippet}</span>
    <span class="result-url">${item.url}</span>
  </div>
`
```

## Tags/Chips Style

```javascript
autocomplete.renderItem = (tag, html, { highlighted }) => html`
  <div class="tag-item ${highlighted ? 'highlighted' : ''}">
    <span
      class="tag-color"
      style="background-color: ${tag.color}"
    ></span>
    <span class="tag-name">${tag.name}</span>
    <span class="tag-count">${tag.count}</span>
  </div>
`
```

```css
.tag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}

.tag-item.highlighted {
  background: var(--pac-highlight-bg);
}

.tag-item .tag-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.tag-item .tag-name {
  flex: 1;
  font-weight: 500;
}

.tag-item .tag-count {
  font-size: 12px;
  color: var(--pac-placeholder-color);
  background: var(--pac-border-color);
  padding: 2px 8px;
  border-radius: 10px;
}
```

## Command Palette

```javascript
autocomplete.renderItem = (command, html, { highlighted }) => html`
  <div class="command-item ${highlighted ? 'highlighted' : ''}">
    <span class="command-icon">${command.icon}</span>
    <div class="command-info">
      <span class="command-name">${command.name}</span>
      <span class="command-description">${command.description}</span>
    </div>
    ${command.shortcut && html`
      <kbd class="command-shortcut">${command.shortcut}</kbd>
    `}
  </div>
`
```

```css
.command-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
}

.command-item.highlighted {
  background: var(--pac-highlight-bg);
}

.command-item .command-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.command-item .command-info {
  flex: 1;
}

.command-item .command-name {
  display: block;
  font-weight: 500;
}

.command-item .command-description {
  font-size: 12px;
  color: var(--pac-placeholder-color);
}

.command-item .command-shortcut {
  font-family: monospace;
  font-size: 11px;
  padding: 2px 6px;
  background: var(--pac-border-color);
  border-radius: 4px;
}
```
