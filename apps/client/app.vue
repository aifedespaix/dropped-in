<template>
  <div
    id="app"
    class="min-h-screen w-screen overflow-hidden font-default"
  >
    <ThreeCanvas />
  </div>
</template>

<script setup lang="ts">
import '@unocss/reset/tailwind.css'

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    }
  ]
})
</script>
