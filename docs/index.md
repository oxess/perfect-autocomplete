---
layout: home

hero:
  name: Perfect Autocomplete
  text: High-quality autocomplete web component
  tagline: Accessible, customizable, and framework-agnostic
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/oxess/perfect-autocomplete

features:
  - icon: ⌨️
    title: Fully Accessible
    details: Complete WAI-ARIA combobox pattern with keyboard navigation and screen reader support.
  - icon: 🎨
    title: Customizable
    details: CSS custom properties for theming, custom templates with htm, and flexible rendering API.
  - icon: 📱
    title: Mobile-First
    details: Touch gestures, virtual keyboard handling, and responsive design out of the box.
  - icon: ⚡
    title: Lightweight
    details: ~42KB bundle size with Vue 3, Floating UI, and htm included.
  - icon: 🔌
    title: Framework Agnostic
    details: Works everywhere as a standard HTML Custom Element.
  - icon: 🧪
    title: Well Tested
    details: Comprehensive unit and browser tests ensure reliability.
---

## Quick Start

```html
<!-- Include the script -->
<script type="module">
  import { register } from '@mikolaj.jeziorny/perfect-autocomplete'
  register()
</script>

<!-- Use the component -->
<input type="search" id="search" />
<perfect-autocomplete
  for="search"
  url="/api/search"
  min-chars="2"
></perfect-autocomplete>
```

## Features

- **Debounced Input** - Configurable debounce delay prevents excessive API calls
- **Smart Positioning** - Automatic flip and shift when near viewport edges
- **Keyboard Navigation** - Full arrow key, Enter, Escape, and Tab support
- **Touch Gestures** - Swipe to dismiss on mobile devices
- **Custom Templates** - Use htm for type-safe, JSX-like templating
- **Accessible** - Complete ARIA implementation with live regions
- **Dark Mode** - Automatic dark mode support via CSS custom properties
- **5 Built-in Themes** - Classic, Basic, Modern, Bootstrap, and Tailwind

## Author

Created by [Mikolaj Jeziorny](https://mikolaj-jeziorny.pl/)
