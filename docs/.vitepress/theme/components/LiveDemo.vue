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
const apiUrl = computed(() => `/api/mock?type=${props.dataType}`)

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

  // Set up custom render if enabled
  if (props.customRender) {
    const autocomplete = el as any

    if (props.dataType === 'users') {
      autocomplete.renderItem = (item: MockItem, h: typeof html, { highlighted }: { highlighted: boolean }) => h`
        <div class="demo-user-item ${highlighted ? 'highlighted' : ''}">
          <div class="demo-user-item__avatar">${getInitials(item.label)}</div>
          <div class="demo-user-item__info">
            <div class="demo-user-item__name">${item.label}</div>
            <div class="demo-user-item__email">${item.email} · ${item.role}</div>
          </div>
        </div>
      `
    } else if (props.dataType === 'products') {
      autocomplete.renderItem = (item: MockItem, h: typeof html, { highlighted }: { highlighted: boolean }) => h`
        <div class="demo-product-item ${highlighted ? 'highlighted' : ''}">
          <div class="demo-product-item__info">
            <div class="demo-product-item__name">${item.label}</div>
            <div class="demo-product-item__category">${item.category}</div>
          </div>
          <div class="demo-product-item__price">${formatPrice(item.price || 0)}</div>
        </div>
      `
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
        :url="apiUrl"
        :theme="theme"
        query-param="q"
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
