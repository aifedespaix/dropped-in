<template>
    <!-- Conteneur Three.js -->
    <div ref="gameContainer" class="fixed inset-0 w-full h-full">
        <div v-if="!gameStore.isPlaying" class="fixed inset-0 w-full h-full flex justify-center items-center z-1000"
            bg="black/80">
            <div class="p-8 rounded-lg text-center w-120 max-w-full overflow-y-auto" bg="light/10 " text="white">
                <div v-if="!currentMenu">
                    <h1 class="text-2xl font-bold mb-4">Menu</h1>
                    <div class="flex flex-col gap-2">
                        <SettingsButton text="Jouer" variant="primary" @click="gameStore.play()" />

                        <SettingsButton text="Options" variant="secondary" @click="currentMenu = menus.options" />
                        <!-- <SettingsButton text="Quitter" variant="danger" @click="gameStore.quit()" /> -->
                    </div>
                </div>

                <!-- Menu Raccourcis -->
                <component v-else :is="currentMenu" @close="currentMenu = $event" />

                <SettingsButton v-if="currentMenu" text="Retour" variant="default" @click="currentMenu = undefined" />

                {{ currentMenu?.name }}
            </div>
            cc
        </div>
        ss
    </div>ss
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/game.store'
import SettingsButton from './Settings/Buttons.vue'
// import ShortcutsModal from './ShortcutsModal.vue'
import { watch } from 'vue'
import { OverlayShortcuts } from '#components'

const gameStore = useGameStore()
const gameContainer = ref<HTMLElement | null>(null)

const currentMenu = shallowRef<Component>()

const menus = {
    options: OverlayShortcuts
}


// Surveiller les changements d'état du jeu
watch(() => gameStore.isPlaying, (isPlaying) => {
    if (!isPlaying) {
        currentMenu.value = undefined
    }
})
</script>