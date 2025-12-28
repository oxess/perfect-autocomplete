import { defineConfig } from 'vitepress'
import type { Plugin } from 'vite'

// Mock data for demos
const mockUsers = [
  { id: 1, label: 'Alice Johnson', value: 'alice', email: 'alice@example.com', role: 'Developer' },
  { id: 2, label: 'Bob Smith', value: 'bob', email: 'bob@example.com', role: 'Designer' },
  { id: 3, label: 'Carol Williams', value: 'carol', email: 'carol@example.com', role: 'Manager' },
  { id: 4, label: 'David Brown', value: 'david', email: 'david@example.com', role: 'Developer' },
  { id: 5, label: 'Emma Davis', value: 'emma', email: 'emma@example.com', role: 'QA Engineer' },
  { id: 6, label: 'Frank Miller', value: 'frank', email: 'frank@example.com', role: 'DevOps' },
  { id: 7, label: 'Grace Wilson', value: 'grace', email: 'grace@example.com', role: 'Product Owner' },
  { id: 8, label: 'Henry Taylor', value: 'henry', email: 'henry@example.com', role: 'Developer' },
]

const mockProducts = [
  { id: 1, label: 'MacBook Pro 16"', value: 'macbook-pro', category: 'Laptops', price: 2499 },
  { id: 2, label: 'iPhone 15 Pro', value: 'iphone-15', category: 'Phones', price: 999 },
  { id: 3, label: 'iPad Air', value: 'ipad-air', category: 'Tablets', price: 599 },
  { id: 4, label: 'AirPods Pro', value: 'airpods-pro', category: 'Audio', price: 249 },
  { id: 5, label: 'Apple Watch Ultra', value: 'watch-ultra', category: 'Wearables', price: 799 },
  { id: 6, label: 'Magic Keyboard', value: 'magic-keyboard', category: 'Accessories', price: 299 },
  { id: 7, label: 'Mac Mini M2', value: 'mac-mini', category: 'Desktops', price: 599 },
]

const mockCities = [
  { id: 1, label: 'New York', value: 'new-york', country: 'United States', population: 8336817 },
  { id: 2, label: 'Los Angeles', value: 'los-angeles', country: 'United States', population: 3979576 },
  { id: 3, label: 'London', value: 'london', country: 'United Kingdom', population: 8982000 },
  { id: 4, label: 'Paris', value: 'paris', country: 'France', population: 2161000 },
  { id: 5, label: 'Tokyo', value: 'tokyo', country: 'Japan', population: 13960000 },
  { id: 6, label: 'Berlin', value: 'berlin', country: 'Germany', population: 3645000 },
  { id: 7, label: 'Sydney', value: 'sydney', country: 'Australia', population: 5312000 },
]

function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use('/api/mock', (req, res) => {
        const url = new URL(req.url || '', 'http://localhost')
        const query = url.searchParams.get('q')?.toLowerCase() || ''
        const type = url.searchParams.get('type') || 'users'

        const dataMap: Record<string, typeof mockUsers> = {
          users: mockUsers,
          products: mockProducts,
          cities: mockCities,
        }

        const data = dataMap[type] || mockUsers
        const filtered = query
          ? data.filter(item => item.label.toLowerCase().includes(query))
          : data

        // Simulate network delay
        setTimeout(() => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(filtered.slice(0, 8)))
        }, 150)
      })
    }
  }
}

export default defineConfig({
  title: 'Perfect Autocomplete',
  description: 'A high-quality, accessible autocomplete web component',

  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'perfect-autocomplete'
      }
    }
  },

  vite: {
    plugins: [mockApiPlugin()]
  },

  head: [
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'Perfect Autocomplete' }],
    ['meta', { name: 'og:description', content: 'A high-quality, accessible autocomplete web component' }]
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'API', link: '/configuration' },
      { text: 'Examples', link: '/examples/' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Installation', link: '/installation' }
        ]
      },
      {
        text: 'Configuration',
        items: [
          { text: 'Attributes', link: '/configuration' },
          { text: 'JavaScript API', link: '/javascript-api' },
          { text: 'Events', link: '/events' }
        ]
      },
      {
        text: 'Customization',
        items: [
          { text: 'Templates', link: '/templates' },
          { text: 'Styling', link: '/styling' }
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Accessibility', link: '/accessibility' },
          { text: 'Framework Integration', link: '/framework-integration' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Live Demo', link: '/examples/live-demo' },
          { text: 'Basic', link: '/examples/' },
          { text: 'Custom Templates', link: '/examples/custom-templates' },
          { text: 'With Images', link: '/examples/with-images' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/perfect-autocomplete' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 <a href="https://mikolaj-jeziorny.pl/" target="_blank">Mikolaj Jeziorny</a>'
    },

    search: {
      provider: 'local'
    }
  }
})
