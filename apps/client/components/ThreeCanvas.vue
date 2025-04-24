<template>
    <div ref="container" class="fixed inset-0 w-full h-full">
        <GameMenu @play="play" v-show="!isFullscreen" />
        <GameOverlay />
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/game.store'

const container = ref<HTMLDivElement | null>(null)
const gameStore = useGameStore()

const { isFullscreen, enter: enterFullscreen } = useFullscreen(container)
const { lock } = usePointerLock(container)

onMounted(() => {
    if (container.value) {
        gameStore.initGameEngine(container.value)
    }
})

watch(isFullscreen, (newVal) => {
    if (newVal) {
        gameStore.play();
    } else {
        gameStore.stop();
    }
})

async function play(e: MouseEvent) {
    console.log('CLICK on', e)
    await lock(e);
    enterFullscreen();
}
</script>