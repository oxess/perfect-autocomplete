import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import CustomLayout from './components/CustomLayout.vue'
import LiveDemo from './components/LiveDemo.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import './styles/demo.css'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    // Register demo components globally
    app.component('LiveDemo', LiveDemo)
    app.component('ThemeSwitcher', ThemeSwitcher)
  }
} satisfies Theme
