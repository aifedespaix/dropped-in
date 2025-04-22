<template>
    <div ref="container" class="fixed inset-0 w-full h-full">
        <!-- <GameOverlay /> -->
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/game.store'

const container = ref<HTMLDivElement | null>(null)
const gameStore = useGameStore()

onMounted(() => {
    if (container.value) {
        gameStore.initGameEngine(container.value)
    }
})
</script>