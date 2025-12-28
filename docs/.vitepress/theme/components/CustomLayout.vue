<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import HeroDemo from './HeroDemo.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <HeroDemo v-if="frontmatter.layout === 'home'" />
    </template>
  </Layout>
</template>
