<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'

interface MockItem {
  id: number
  label: string
  value: string
  email?: string
  role?: string
  category?: string
  price?: number
  country?: string
  population?: number
}

type DataType = 'users' | 'products' | 'cities'
type Theme = 'classic' | 'basic' | 'modern' | 'bootstrap' | 'tailwind'

// Client-side mock data (works on static hosting like GitHub Pages)
const mockData: Record<DataType, MockItem[]> = {
  users: [
    { id: 1, label: 'Alice Johnson', value: 'alice', email: 'alice@example.com', role: 'Developer' },
    { id: 2, label: 'Bob Smith', value: 'bob', email: 'bob@example.com', role: 'Designer' },
    { id: 3, label: 'Carol Williams', value: 'carol', email: 'carol@example.com', role: 'Manager' },
    { id: 4, label: 'David Brown', value: 'david', email: 'david@example.com', role: 'Developer' },
    { id: 5, label: 'Emma Davis', value: 'emma', email: 'emma@example.com', role: 'QA Engineer' },
    { id: 6, label: 'Frank Miller', value: 'frank', email: 'frank@example.com', role: 'DevOps' },
    { id: 7, label: 'Grace Wilson', value: 'grace', email: 'grace@example.com', role: 'Product Owner' },
    { id: 8, label: 'Henry Taylor', value: 'henry', email: 'henry@example.com', role: 'Developer' },
    { id: 9, label: 'Ivy Chen', value: 'ivy', email: 'ivy@example.com', role: 'UX Designer' },
    { id: 10, label: 'Jack Martinez', value: 'jack', email: 'jack@example.com', role: 'Backend Developer' },
    { id: 11, label: 'Karen Lee', value: 'karen', email: 'karen@example.com', role: 'Frontend Developer' },
    { id: 12, label: 'Leo Anderson', value: 'leo', email: 'leo@example.com', role: 'Tech Lead' },
    { id: 13, label: 'Mia Thompson', value: 'mia', email: 'mia@example.com', role: 'Data Scientist' },
    { id: 14, label: 'Noah Garcia', value: 'noah', email: 'noah@example.com', role: 'DevOps Engineer' },
    { id: 15, label: 'Olivia Robinson', value: 'olivia', email: 'olivia@example.com', role: 'Scrum Master' },
  ],
  products: [
    { id: 1, label: 'MacBook Pro 16"', value: 'macbook-pro', category: 'Laptops', price: 2499 },
    { id: 2, label: 'iPhone 15 Pro', value: 'iphone-15', category: 'Phones', price: 999 },
    { id: 3, label: 'iPad Air', value: 'ipad-air', category: 'Tablets', price: 599 },
    { id: 4, label: 'AirPods Pro', value: 'airpods-pro', category: 'Audio', price: 249 },
    { id: 5, label: 'Apple Watch Ultra', value: 'watch-ultra', category: 'Wearables', price: 799 },
    { id: 6, label: 'Magic Keyboard', value: 'magic-keyboard', category: 'Accessories', price: 299 },
    { id: 7, label: 'Mac Mini M2', value: 'mac-mini', category: 'Desktops', price: 599 },
    { id: 8, label: 'MacBook Air 15"', value: 'macbook-air', category: 'Laptops', price: 1299 },
    { id: 9, label: 'iPhone 15', value: 'iphone-15-base', category: 'Phones', price: 799 },
    { id: 10, label: 'iPad Pro 12.9"', value: 'ipad-pro', category: 'Tablets', price: 1099 },
    { id: 11, label: 'AirPods Max', value: 'airpods-max', category: 'Audio', price: 549 },
    { id: 12, label: 'Apple Watch Series 9', value: 'watch-series-9', category: 'Wearables', price: 399 },
    { id: 13, label: 'Magic Trackpad', value: 'magic-trackpad', category: 'Accessories', price: 149 },
    { id: 14, label: 'Mac Studio', value: 'mac-studio', category: 'Desktops', price: 1999 },
    { id: 15, label: 'Pro Display XDR', value: 'pro-display', category: 'Monitors', price: 4999 },
  ],
  cities: [
    { id: 1, label: 'New York', value: 'new-york', country: 'United States', population: 8336817 },
    { id: 2, label: 'Los Angeles', value: 'los-angeles', country: 'United States', population: 3979576 },
    { id: 3, label: 'London', value: 'london', country: 'United Kingdom', population: 8982000 },
    { id: 4, label: 'Paris', value: 'paris', country: 'France', population: 2161000 },
    { id: 5, label: 'Tokyo', value: 'tokyo', country: 'Japan', population: 13960000 },
    { id: 6, label: 'Berlin', value: 'berlin', country: 'Germany', population: 3645000 },
    { id: 7, label: 'Sydney', value: 'sydney', country: 'Australia', population: 5312000 },
    { id: 8, label: 'Toronto', value: 'toronto', country: 'Canada', population: 2930000 },
    { id: 9, label: 'Singapore', value: 'singapore', country: 'Singapore', population: 5454000 },
    { id: 10, label: 'Dubai', value: 'dubai', country: 'UAE', population: 3400000 },
    { id: 11, label: 'Amsterdam', value: 'amsterdam', country: 'Netherlands', population: 873000 },
    { id: 12, label: 'Barcelona', value: 'barcelona', country: 'Spain', population: 1620000 },
    { id: 13, label: 'San Francisco', value: 'san-francisco', country: 'United States', population: 874000 },
    { id: 14, label: 'Seoul', value: 'seoul', country: 'South Korea', population: 9776000 },
    { id: 15, label: 'Mumbai', value: 'mumbai', country: 'India', population: 20700000 },
  ]
}

const props = withDefaults(defineProps<{
  title?: string
  dataType?: DataType
  showEvents?: boolean
  customRender?: boolean
  theme?: Theme
}>(), {
  title: 'Try it out',
  dataType: 'users',
  showEvents: true,
  customRender: false,
  theme: 'classic'
})

const inputId = `demo-input-${Math.random().toString(36).slice(2, 9)}`
const autocompleteRef = ref<HTMLElement | null>(null)
const selectedItem = ref<MockItem | null>(null)
const events = ref<Array<{ name: string; time: string; detail?: string }>>([])

const placeholderMap = {
  users: 'Search users (try "alice", "bob", "dev")...',
  products: 'Search products (try "mac", "iphone", "air")...',
  cities: 'Search cities (try "new", "london", "paris")...'
}

const placeholder = computed(() => placeholderMap[props.dataType])

function logEvent(name: string, detail?: Record<string, unknown>) {
  const time = new Date().toLocaleTimeString()
  events.value.push({
    name,
    time,
    detail: detail ? JSON.stringify(detail) : undefined
  })
  // Keep only last 10 events
  if (events.value.length > 10) {
    events.value.shift()
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`
}

function formatPopulation(pop: number): string {
  if (pop >= 1000000) {
    return `${(pop / 1000000).toFixed(1)}M`
  }
  return `${(pop / 1000).toFixed(0)}K`
}

onMounted(async () => {
  // Dynamically import and register the component (client-side only)
  const { register, html } = await import('../../../../src/index')
  register()

  await nextTick()

  const el = autocompleteRef.value
  if (!el) return

  const autocomplete = el as any

  // Set up custom fetch function using client-side mock data
  // This works on static hosting (GitHub Pages) without needing a server
  autocomplete.setFetchFn(async (query: string): Promise<MockItem[]> => {
    // Simulate network delay for realistic demo
    await new Promise(resolve => setTimeout(resolve, 150))

    const data = mockData[props.dataType]
    if (!query) return data.slice(0, 8)

    const lowerQuery = query.toLowerCase()
    const filtered = data.filter(item => {
      // Search in label
      if (item.label.toLowerCase().includes(lowerQuery)) return true
      // Search in role (for users)
      if (item.role?.toLowerCase().includes(lowerQuery)) return true
      // Search in category (for products)
      if (item.category?.toLowerCase().includes(lowerQuery)) return true
      // Search in country (for cities)
      if (item.country?.toLowerCase().includes(lowerQuery)) return true
      return false
    })

    return filtered.slice(0, 8)
  })

  // Set up custom render if enabled
  if (props.customRender) {
    if (props.dataType === 'users') {
      autocomplete.setRenderItem((item: MockItem, h: typeof html, { highlighted }: { highlighted: boolean }) => h`
        <div class="demo-user-item ${highlighted ? 'highlighted' : ''}">
          <div class="demo-user-item__avatar">${getInitials(item.label)}</div>
          <div class="demo-user-item__info">
            <div class="demo-user-item__name">${item.label}</div>
            <div class="demo-user-item__email">${item.email} · ${item.role}</div>
          </div>
        </div>
      `)
    } else if (props.dataType === 'products') {
      autocomplete.setRenderItem((item: MockItem, h: typeof html, { highlighted }: { highlighted: boolean }) => h`
        <div class="demo-product-item ${highlighted ? 'highlighted' : ''}">
          <div class="demo-product-item__info">
            <div class="demo-product-item__name">${item.label}</div>
            <div class="demo-product-item__category">${item.category}</div>
          </div>
          <div class="demo-product-item__price">${formatPrice(item.price || 0)}</div>
        </div>
      `)
    }
  }

  // Set up event listeners
  el.addEventListener('pac:open', () => logEvent('pac:open'))
  el.addEventListener('pac:close', () => logEvent('pac:close'))
  el.addEventListener('pac:select', ((e: CustomEvent) => {
    const { item, index } = e.detail
    selectedItem.value = item
    logEvent('pac:select', { label: item.label, index })
  }) as EventListener)
  el.addEventListener('pac:items-loaded', ((e: CustomEvent) => {
    const { items, query } = e.detail
    logEvent('pac:items-loaded', { count: items.length, query })
  }) as EventListener)
  el.addEventListener('pac:error', ((e: CustomEvent) => {
    logEvent('pac:error', { message: e.detail.error.message })
  }) as EventListener)
})
</script>

<template>
  <div class="live-demo">
    <div class="live-demo__preview">
      <label :for="inputId">{{ title }}</label>
      <input
        type="search"
        :id="inputId"
        :placeholder="placeholder"
        autocomplete="off"
      />
      <perfect-autocomplete
        ref="autocompleteRef"
        :for="inputId"
        :theme="theme"
        min-chars="1"
        debounce="200"
        max-items="8"
        placement="bottom-start"
      />

      <div v-if="selectedItem" class="live-demo__selected">
        <strong>Selected:</strong> {{ selectedItem.label }} ({{ selectedItem.value }})
      </div>

      <div v-if="showEvents && events.length > 0" class="live-demo__events">
        <div class="live-demo__events-title">Event Log</div>
        <div
          v-for="(event, i) in events"
          :key="i"
          class="live-demo__event"
        >
          <span class="live-demo__event-time">[{{ event.time }}]</span>
          <span class="live-demo__event-name">{{ event.name }}</span>
          <span v-if="event.detail">: {{ event.detail }}</span>
        </div>
      </div>
    </div>
    <div class="live-demo__footer">
      <span class="live-demo__badge">Live Demo</span>
      Type to search the mock {{ dataType }} data
    </div>
  </div>
</template>
