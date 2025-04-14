<template>
    <div class="bg-dark-800 p-8 rounded-lg text-white w-full relative">
        <h2 class="text-center mb-8 text-white col-span-2">Raccourcis</h2>
        <div class="gap-8">
            <div class="bg-dark-700 p-6 rounded-md">
                <h3 class="mb-4 text-white border-b border-dark-500 pb-2">Mouvement</h3>
                <div v-for="[action, keys] in keyboardShortcuts" :key="action"
                    class="flex justify-between items-center mb-3 p-2 bg-dark-700 rounded">
                    <span>{{ getActionLabel(action) }}</span>
                    <div class="flex gap-2 items-center">
                        <div class="flex gap-2 items-center">
                            <div v-for="key in keys" :key="key" class="flex items-center">
                                <div class="relative group">
                                    <kbd class="bg-dark-800 px-2 py-1 rounded font-mono text-sm text-white pr-6">
                                        {{ key }}</kbd>
                                    <button @click="unmapKey(key, action)"
                                        class="cursor-pointer bg-transparent rounded-full border-none absolute right-1 top-1/2 -translate-y-1/2 p-0.5 text-xs text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        :disabled="isMapping">
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button @click="startMapping(action)"
                            class="p-1 rounded border-none cursor-pointer text-xs transition-colors flex items-center justify-center min-w-6 h-6 bg-dark-500 text-white hover:bg-dark-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="isMapping">
                            +
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-dark-700 p-6 rounded-md">
                <h3 class="mb-4 text-white border-b border-dark-500 pb-2">Caméra</h3>
                <div class="flex justify-between items-center mb-3 p-2 bg-dark-600 rounded">
                    <span>Rotation</span>
                    <kbd class="bg-dark-500 px-2 py-1 rounded font-mono text-sm text-white">Souris</kbd>
                </div>
                <div class="flex justify-between items-center mb-3 p-2 bg-dark-600 rounded">
                    <span>Zoom +</span>
                    <kbd class="bg-dark-500 px-2 py-1 rounded font-mono text-sm text-white">Molette</kbd>
                </div>
                <div class="flex justify-between items-center mb-3 p-2 bg-dark-600 rounded">
                    <span>Zoom -</span>
                    <kbd class="bg-dark-500 px-2 py-1 rounded font-mono text-sm text-white">Molette</kbd>
                </div>
            </div>

            <div class="bg-dark-700 p-6 rounded-md">
                <h3 class="mb-4 text-white border-b border-dark-500 pb-2">Interface</h3>
                <div class="flex justify-between items-center mb-3 p-2 bg-dark-600 rounded">
                    <span>Plein écran</span>
                    <kbd class="bg-dark-500 px-2 py-1 rounded font-mono text-sm text-white">F11</kbd>
                </div>
                <div class="flex justify-between items-center mb-3 p-2 bg-dark-600 rounded">
                    <span>Menu raccourcis</span>
                    <kbd class="bg-dark-500 px-2 py-1 rounded font-mono text-sm text-white">Échap</kbd>
                </div>
            </div>
        </div>

        <div v-if="isMapping && mappingAction"
            class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 p-8 rounded-lg text-center z-1000 flex flex-col gap-4">
            Appuyez sur une touche pour mapper l'action "{{ getActionLabel(mappingAction) }}"
            <button @click="stopMapping" class="bg-red-800 text-white px-4 py-2 self-center hover:bg-red-700">
                Annuler
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/game.store'
import type { CharacterAction } from '~/lib/three/types/CharacterActions'
import { computed, ref } from 'vue'

const gameStore = useGameStore()
const mappingAction = ref<CharacterAction | null>(null)

const keyboardShortcuts = computed(() => {
    if (!gameStore.inputManager) return new Map()
    return gameStore.inputManager.getKeyboardShortcuts()
})

const isMapping = computed(() => {
    if (!gameStore.inputManager) return false
    return gameStore.inputManager.isKeyMapping()
})

const getActionLabel = (action: CharacterAction): string => {
    if (!gameStore.inputManager) return action
    return gameStore.inputManager.getActionLabel(action)
}

const startMapping = (action: CharacterAction) => {
    if (!gameStore.inputManager) return
    mappingAction.value = action
    gameStore.inputManager.startKeyMapping((key) => {
        // Vérifier si la touche est déjà utilisée pour cette action
        const existingKeys = gameStore.inputManager?.getActionKeys(action) || []
        const formattedKey = key.replace(/^Key/, '').replace(/^Space$/, 'Espace')

        if (existingKeys.some(existingKey => {
            const formattedExistingKey = existingKey.replace(/^Key/, '').replace(/^Space$/, 'Espace')
            return formattedExistingKey === formattedKey
        })) {
            return // Ne pas ajouter la touche si elle existe déjà
        }

        gameStore.inputManager?.mapKey(key, action)
    })
}

const stopMapping = () => {
    if (!gameStore.inputManager) return
    gameStore.inputManager.stopKeyMapping()
    mappingAction.value = null
}

const unmapKey = (displayKey: string, action: CharacterAction) => {
    if (!gameStore.inputManager) return

    // On récupère toutes les touches de l'action
    const keys = gameStore.inputManager.getActionKeys(action)

    // On trouve la touche qui correspond à la clé d'affichage
    const keyToRemove = keys.find(key => {
        const formattedKey = key.replace(/^Key/, '').replace(/^Space$/, 'Espace')
        return formattedKey === displayKey
    })

    if (keyToRemove) {
        gameStore.inputManager.unmapKey(keyToRemove, action)
    }
}
</script>
