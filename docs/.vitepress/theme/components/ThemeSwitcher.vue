<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

type Theme = 'classic' | 'basic' | 'modern' | 'bootstrap' | 'tailwind'

interface MockUser {
  id: number
  label: string
  value: string
  email: string
  role: string
}

// Client-side mock data for theme switcher
const mockUsers: MockUser[] = [
  { id: 1, label: 'Alice Johnson', value: 'alice', email: 'alice@example.com', role: 'Developer' },
  { id: 2, label: 'Bob Smith', value: 'bob', email: 'bob@example.com', role: 'Designer' },
  { id: 3, label: 'Carol Williams', value: 'carol', email: 'carol@example.com', role: 'Manager' },
  { id: 4, label: 'David Brown', value: 'david', email: 'david@example.com', role: 'Developer' },
  { id: 5, label: 'Emma Davis', value: 'emma', email: 'emma@example.com', role: 'QA Engineer' },
  { id: 6, label: 'Frank Miller', value: 'frank', email: 'frank@example.com', role: 'DevOps' },
  { id: 7, label: 'Grace Wilson', value: 'grace', email: 'grace@example.com', role: 'Product Owner' },
  { id: 8, label: 'Henry Taylor', value: 'henry', email: 'henry@example.com', role: 'Developer' },
]

const themes: { value: Theme; label: string; description: string }[] = [
  { value: 'classic', label: 'Classic', description: 'Traditional, timeless design' },
  { value: 'basic', label: 'Basic', description: 'Minimal, simple styling' },
  { value: 'modern', label: 'Modern', description: 'Contemporary with smooth shadows' },
  { value: 'bootstrap', label: 'Bootstrap', description: 'Bootstrap 5 inspired' },
  { value: 'tailwind', label: 'Tailwind', description: 'Tailwind CSS inspired' },
]

const currentTheme = ref<Theme>('classic')
const inputId = `theme-demo-${Math.random().toString(36).slice(2, 9)}`
const autocompleteRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  const { register } = await import('../../../../src/index')
  register()

  await nextTick()

  const el = autocompleteRef.value
  if (!el) return

  const autocomplete = el as any

  // Set up custom fetch function using client-side mock data
  autocomplete.setFetchFn(async (query: string): Promise<MockUser[]> => {
    await new Promise(resolve => setTimeout(resolve, 100))

    if (!query) return mockUsers.slice(0, 6)

    const lowerQuery = query.toLowerCase()
    const filtered = mockUsers.filter(item =>
      item.label.toLowerCase().includes(lowerQuery) ||
      item.role.toLowerCase().includes(lowerQuery)
    )

    return filtered.slice(0, 6)
  })
})

watch(currentTheme, async () => {
  await nextTick()
  const el = autocompleteRef.value
  if (el) {
    (el as any).theme = currentTheme.value
  }
})
</script>

<template>
  <div class="theme-switcher">
    <div class="theme-switcher__controls">
      <label class="theme-switcher__label">Select Theme:</label>
      <div class="theme-switcher__buttons">
        <button
          v-for="theme in themes"
          :key="theme.value"
          :class="['theme-switcher__button', { active: currentTheme === theme.value }]"
          @click="currentTheme = theme.value"
        >
          {{ theme.label }}
        </button>
      </div>
      <p class="theme-switcher__description">
        {{ themes.find(t => t.value === currentTheme)?.description }}
      </p>
    </div>

    <div class="theme-switcher__preview">
      <label :for="inputId">Search with {{ currentTheme }} theme</label>
      <input
        type="search"
        :id="inputId"
        placeholder="Type to search users..."
        autocomplete="off"
      />
      <perfect-autocomplete
        ref="autocompleteRef"
        :for="inputId"
        :theme="currentTheme"
        min-chars="1"
        debounce="200"
        max-items="6"
        placement="bottom-start"
      />
    </div>

    <div class="theme-switcher__code">
      <pre><code>&lt;perfect-autocomplete
  theme="{{ currentTheme }}"
  for="search"
  url="/api/search"
/&gt;</code></pre>
    </div>
  </div>
</template>

<style>
.theme-switcher {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.theme-switcher__controls {
  padding: 16px 20px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.theme-switcher__label {
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--vp-c-text-1);
}

.theme-switcher__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.theme-switcher__button {
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.theme-switcher__button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.theme-switcher__button.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.theme-switcher__description {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.theme-switcher__preview {
  padding: 24px 20px;
  background: var(--vp-c-bg-soft);
}

.theme-switcher__preview label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.theme-switcher__preview input[type="search"] {
  width: 100%;
  padding: 10px 14px;
  font-size: 15px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.theme-switcher__preview input[type="search"]:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.theme-switcher__code {
  padding: 16px 20px;
  background: var(--vp-c-bg-alt);
  border-top: 1px solid var(--vp-c-divider);
}

.theme-switcher__code pre {
  margin: 0;
  padding: 12px 16px;
  background: var(--vp-c-bg);
  border-radius: 6px;
  overflow-x: auto;
}

.theme-switcher__code code {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--vp-c-text-1);
}
</style>
