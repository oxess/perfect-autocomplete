# With Images

Examples of autocomplete with image support.

## Basic Image Support

The default template automatically renders images when the `image` property is present:

```javascript
// API response format
[
  {
    "id": 1,
    "label": "John Doe",
    "value": "john",
    "image": "https://example.com/avatars/john.jpg"
  },
  {
    "id": 2,
    "label": "Jane Smith",
    "value": "jane",
    "image": "https://example.com/avatars/jane.jpg"
  }
]
```

```html
<input type="search" id="user-search" />
<perfect-autocomplete
  for="user-search"
  url="/api/users"
></perfect-autocomplete>
```

## Custom Image Styling

Override default image styles:

```css
perfect-autocomplete {
  --pac-image-size: 48px;
  --pac-image-border-radius: 50%; /* Circular images */
}
```

## Product Gallery

```javascript
autocomplete.renderItem = (product, html, { highlighted }) => html`
  <div class="product-result ${highlighted ? 'highlighted' : ''}">
    <div class="product-image-container">
      <img
        src=${product.image}
        alt=${product.name}
        loading="lazy"
      />
      ${product.discount && html`
        <span class="discount-badge">-${product.discount}%</span>
      `}
    </div>
    <div class="product-info">
      <span class="product-name">${product.name}</span>
      <span class="product-brand">${product.brand}</span>
      <div class="product-price">
        ${product.originalPrice !== product.price && html`
          <span class="original-price">$${product.originalPrice}</span>
        `}
        <span class="current-price">$${product.price}</span>
      </div>
    </div>
  </div>
`
```

```css
.product-result {
  display: flex;
  gap: 16px;
  padding: 12px;
}

.product-result.highlighted {
  background: var(--pac-highlight-bg);
}

.product-image-container {
  position: relative;
  flex-shrink: 0;
}

.product-image-container img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.discount-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  display: block;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-brand {
  font-size: 12px;
  color: var(--pac-placeholder-color);
}

.product-price {
  margin-top: 4px;
}

.original-price {
  text-decoration: line-through;
  color: var(--pac-placeholder-color);
  font-size: 12px;
  margin-right: 4px;
}

.current-price {
  font-weight: 600;
  color: #22c55e;
}
```

## Avatar with Status

```javascript
autocomplete.renderItem = (user, html, { highlighted }) => html`
  <div class="user-with-status ${highlighted ? 'highlighted' : ''}">
    <div class="avatar-container">
      <img
        src=${user.avatar}
        alt=${user.name}
        class="avatar"
      />
      <span class="status-dot ${user.status}"></span>
    </div>
    <div class="user-details">
      <span class="name">${user.name}</span>
      <span class="last-seen">
        ${user.status === 'online' ? 'Online' : `Last seen ${user.lastSeen}`}
      </span>
    </div>
  </div>
`
```

```css
.user-with-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
}

.user-with-status.highlighted {
  background: var(--pac-highlight-bg);
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border: 2px solid var(--pac-bg-color);
  border-radius: 50%;
}

.status-dot.online {
  background: #22c55e;
}

.status-dot.away {
  background: #f59e0b;
}

.status-dot.offline {
  background: #9ca3af;
}

.user-details {
  flex: 1;
}

.user-details .name {
  display: block;
  font-weight: 500;
}

.user-details .last-seen {
  font-size: 12px;
  color: var(--pac-placeholder-color);
}
```

## Lazy Loading Images

For better performance with many images:

```javascript
autocomplete.renderItem = (item, html, { highlighted }) => html`
  <div class="lazy-image-item ${highlighted ? 'highlighted' : ''}">
    <img
      src="/placeholder.svg"
      data-src=${item.image}
      alt=${item.label}
      class="lazy-image"
      loading="lazy"
    />
    <span>${item.label}</span>
  </div>
`

// Use Intersection Observer to load images
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      observer.unobserve(img)
    }
  })
})

autocomplete.addEventListener('pac:items-loaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.lazy-image[data-src]').forEach(img => {
      observer.observe(img)
    })
  }, 0)
})
```

## Fallback Images

Handle broken images gracefully:

```javascript
autocomplete.renderItem = (item, html, { highlighted }) => html`
  <div class="item-with-fallback ${highlighted ? 'highlighted' : ''}">
    <img
      src=${item.image}
      alt=${item.label}
      onerror="this.src='/fallback-image.png'"
    />
    <span>${item.label}</span>
  </div>
`
```
