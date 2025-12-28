# Framework Integration

Perfect Autocomplete works with any framework as a standard web component.

## React

```jsx
import { useEffect, useRef } from 'react'
import { register } from '@mikolaj.jeziorny/perfect-autocomplete'

// Register once at app startup
register()

function SearchInput() {
  const autocompleteRef = useRef(null)

  useEffect(() => {
    const autocomplete = autocompleteRef.current

    const handleSelect = (e) => {
      console.log('Selected:', e.detail.item)
    }

    autocomplete.addEventListener('pac:select', handleSelect)
    return () => {
      autocomplete.removeEventListener('pac:select', handleSelect)
    }
  }, [])

  return (
    <>
      <label htmlFor="search">Search</label>
      <input type="search" id="search" />
      <perfect-autocomplete
        ref={autocompleteRef}
        for="search"
        url="/api/search"
      />
    </>
  )
}
```

### With TypeScript

```tsx
import { useEffect, useRef } from 'react'
import { register, AutocompleteItem } from '@mikolaj.jeziorny/perfect-autocomplete'

register()

function SearchInput() {
  const autocompleteRef = useRef<HTMLElementTagNameMap['perfect-autocomplete']>(null)

  useEffect(() => {
    const handleSelect = (e: CustomEvent<{ item: AutocompleteItem }>) => {
      console.log('Selected:', e.detail.item)
    }

    autocompleteRef.current?.addEventListener('pac:select', handleSelect)
    return () => {
      autocompleteRef.current?.removeEventListener('pac:select', handleSelect)
    }
  }, [])

  return (
    <>
      <input type="search" id="search" />
      <perfect-autocomplete
        ref={autocompleteRef}
        for="search"
        url="/api/search"
      />
    </>
  )
}
```

## Vue

```vue
<template>
  <label for="search">Search</label>
  <input type="search" id="search" />
  <perfect-autocomplete
    ref="autocomplete"
    for="search"
    url="/api/search"
    @pac:select="handleSelect"
    @pac:error="handleError"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { register } from '@mikolaj.jeziorny/perfect-autocomplete'

register()

const autocomplete = ref(null)

function handleSelect(event) {
  console.log('Selected:', event.detail.item)
}

function handleError(event) {
  console.error('Error:', event.detail.error)
}
</script>

<style>
/* Configure Vue to recognize the custom element */
/* In vite.config.ts, add isCustomElement */
</style>
```

### Vue Config

```typescript
// vite.config.ts
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('perfect-')
        }
      }
    })
  ]
}
```

## Angular

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

```typescript
// main.ts or app.component.ts
import { register } from '@mikolaj.jeziorny/perfect-autocomplete'
register()
```

```html
<!-- app.component.html -->
<label for="search">Search</label>
<input type="search" id="search" />
<perfect-autocomplete
  for="search"
  url="/api/search"
  (pac:select)="onSelect($event)"
></perfect-autocomplete>
```

```typescript
// app.component.ts
@Component({...})
export class AppComponent {
  onSelect(event: CustomEvent) {
    console.log('Selected:', event.detail.item)
  }
}
```

## Svelte

```svelte
<script>
  import { onMount } from 'svelte'
  import { register } from '@mikolaj.jeziorny/perfect-autocomplete'

  onMount(() => {
    register()
  })

  function handleSelect(event) {
    console.log('Selected:', event.detail.item)
  }
</script>

<label for="search">Search</label>
<input type="search" id="search" />
<perfect-autocomplete
  for="search"
  url="/api/search"
  on:pac:select={handleSelect}
/>
```

### Svelte Config

```javascript
// svelte.config.js
export default {
  compilerOptions: {
    customElement: true
  }
}
```

## Solid

```jsx
import { onMount } from 'solid-js'
import { register } from '@mikolaj.jeziorny/perfect-autocomplete'

function SearchInput() {
  let autocompleteRef

  onMount(() => {
    register()

    autocompleteRef.addEventListener('pac:select', (e) => {
      console.log('Selected:', e.detail.item)
    })
  })

  return (
    <>
      <input type="search" id="search" />
      <perfect-autocomplete
        ref={autocompleteRef}
        for="search"
        url="/api/search"
      />
    </>
  )
}
```

## Alpine.js

```html
<div x-data="{ selectedItem: null }">
  <input type="search" id="search" />
  <perfect-autocomplete
    for="search"
    url="/api/search"
    x-on:pac:select="selectedItem = $event.detail.item"
  ></perfect-autocomplete>

  <template x-if="selectedItem">
    <p>Selected: <span x-text="selectedItem.label"></span></p>
  </template>
</div>

<script type="module">
  import { register } from '@mikolaj.jeziorny/perfect-autocomplete'
  register()
</script>
```

## HTMX

```html
<input
  type="search"
  id="search"
  hx-trigger="pac:select from:next perfect-autocomplete"
  hx-get="/api/details"
  hx-target="#details"
/>
<perfect-autocomplete
  for="search"
  url="/api/search"
></perfect-autocomplete>

<div id="details"></div>

<script type="module">
  import { register } from '@mikolaj.jeziorny/perfect-autocomplete'
  register()

  // Pass selected item to HTMX request
  document.body.addEventListener('pac:select', (e) => {
    const input = document.querySelector('#search')
    input.setAttribute('hx-vals', JSON.stringify({ id: e.detail.item.id }))
  })
</script>
```

## Vanilla JavaScript

```html
<input type="search" id="search" />
<perfect-autocomplete for="search" url="/api/search"></perfect-autocomplete>

<script type="module">
  import { register } from '@mikolaj.jeziorny/perfect-autocomplete'

  register()

  const autocomplete = document.querySelector('perfect-autocomplete')

  autocomplete.addEventListener('pac:select', (e) => {
    console.log('Selected:', e.detail.item)
  })
</script>
```
