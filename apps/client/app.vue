<template>
  <div id="app" class="w-full h-full font-default">
    <ThreeCanvas />
  </div>
</template>

<script setup lang="ts">
import '@unocss/reset/eric-meyer.css'

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    }
  ]
})
</script>
