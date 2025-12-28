<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface MockItem {
  id: number
  label: string
  value: string
  email?: string
  role?: string
}

const mockUsers: MockItem[] = [
  { id: 1, label: 'Alice Johnson', value: 'alice', email: 'alice@example.com', role: 'Developer' },
  { id: 2, label: 'Bob Smith', value: 'bob', email: 'bob@example.com', role: 'Designer' },
  { id: 3, label: 'Carol Williams', value: 'carol', email: 'carol@example.com', role: 'Manager' },
  { id: 4, label: 'David Brown', value: 'david', email: 'david@example.com', role: 'Developer' },
  { id: 5, label: 'Emma Davis', value: 'emma', email: 'emma@example.com', role: 'QA Engineer' },
  { id: 6, label: 'Frank Miller', value: 'frank', email: 'frank@example.com', role: 'DevOps' },
  { id: 7, label: 'Grace Wilson', value: 'grace', email: 'grace@example.com', role: 'Product Owner' },
  { id: 8, label: 'Henry Taylor', value: 'henry', email: 'henry@example.com', role: 'Developer' },
]

const inputId = 'hero-demo-input'
const autocompleteRef = ref<HTMLElement | null>(null)
const selectedItem = ref<MockItem | null>(null)

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

onMounted(async () => {
  const { register, html } = await import('../../../../src/index')
  register()

  await nextTick()

  const el = autocompleteRef.value
  if (!el) return

  const autocomplete = el as any

  autocomplete.setFetchFn(async (query: string): Promise<MockItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 120))

    if (!query) return mockUsers.slice(0, 6)

    const lowerQuery = query.toLowerCase()
    const filtered = mockUsers.filter(item => {
      if (item.label.toLowerCase().includes(lowerQuery)) return true
      if (item.role?.toLowerCase().includes(lowerQuery)) return true
      return false
    })

    return filtered.slice(0, 6)
  })

  autocomplete.setRenderItem((item: MockItem, h: typeof html, { highlighted }: { highlighted: boolean }) => h`
    <div class="hero-demo-item ${highlighted ? 'highlighted' : ''}">
      <div class="hero-demo-item__avatar">${getInitials(item.label)}</div>
      <div class="hero-demo-item__info">
        <div class="hero-demo-item__name">${item.label}</div>
        <div class="hero-demo-item__role">${item.role}</div>
      </div>
    </div>
  `)

  el.addEventListener('pac:select', ((e: CustomEvent) => {
    selectedItem.value = e.detail.item
  }) as EventListener)
})
</script>

<template>
  <div class="hero-demo">
    <div class="hero-demo__container">
      <div class="hero-demo__label">Try it now</div>
      <div class="hero-demo__input-wrapper">
        <svg class="hero-demo__search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          type="search"
          :id="inputId"
          placeholder="Search users..."
          autocomplete="off"
        />
      </div>
      <perfect-autocomplete
        ref="autocompleteRef"
        :for="inputId"
        theme="modern"
        min-chars="1"
        debounce="150"
        max-items="6"
        placement="bottom-start"
      />
      <div class="hero-demo__hint">
        Try typing "alice", "dev", or "design"
      </div>
      <div v-if="selectedItem" class="hero-demo__selected">
        Selected: <strong>{{ selectedItem.label }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-demo {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.hero-demo__container {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.hero-demo__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-demo__input-wrapper {
  position: relative;
}

.hero-demo__search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.hero-demo__input-wrapper input {
  width: 100%;
  padding: 14px 16px 14px 46px;
  font-size: 16px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.hero-demo__input-wrapper input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.hero-demo__input-wrapper input::placeholder {
  color: var(--vp-c-text-3);
}

.hero-demo__hint {
  margin-top: 12px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-align: center;
}

.hero-demo__selected {
  margin-top: 16px;
  padding: 12px 16px;
  background: var(--vp-c-brand-soft);
  border-radius: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.hero-demo__selected strong {
  color: var(--vp-c-brand-1);
}

/* Mobile styles */
@media (max-width: 768px) {
  .hero-demo {
    max-width: 100%;
    padding: 0 16px;
    margin-top: 8px;
  }

  .hero-demo__container {
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .hero-demo__label {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .hero-demo__input-wrapper input {
    padding: 12px 14px 12px 42px;
    font-size: 16px;
  }

  .hero-demo__search-icon {
    left: 12px;
    width: 18px;
    height: 18px;
  }

  .hero-demo__hint {
    font-size: 12px;
    margin-top: 10px;
  }
}
</style>

<style>
/* Custom item styles - unscoped for shadow DOM */
.hero-demo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.hero-demo-item.highlighted {
  background: var(--vp-c-brand-soft, rgba(59, 130, 246, 0.1));
}

.hero-demo-item__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--vp-c-brand-1, #3b82f6) 0%, var(--vp-c-brand-2, #8b5cf6) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
}

.hero-demo-item__info {
  flex: 1;
  min-width: 0;
}

.hero-demo-item__name {
  font-weight: 500;
  color: var(--vp-c-text-1, #1a1a1a);
  font-size: 14px;
}

.hero-demo-item__role {
  font-size: 12px;
  color: var(--vp-c-text-2, #666);
  margin-top: 2px;
}
</style>
