<template>
    <div class="shortcuts-container">
        <h2 class="grid-col-span-2">Raccourcis</h2>
        <div class="shortcuts-grid">
            <div class="shortcut-category">
                <h3>Mouvement</h3>
                <div v-for="[action, keys] in keyboardShortcuts" :key="action" class="shortcut-item">
                    <span>{{ getActionLabel(action) }}</span>
                    <div class="shortcut-actions">
                        <div class="keys-container">
                            <div v-for="key in keys" :key="key" class="key-wrapper">
                                <kbd>{{ key }}</kbd>
                                <button @click="unmapKey(key, action)" class="unmap-button" :disabled="isMapping">
                                    ×
                                </button>
                            </div>
                        </div>
                        <button @click="startMapping(action)" class="add-button" :disabled="isMapping">
                            +
                        </button>
                    </div>
                </div>
            </div>

            <div class="shortcut-category">
                <h3>Caméra</h3>
                <div class="shortcut-item">
                    <span>Rotation</span>
                    <kbd>Souris</kbd>
                </div>
                <div class="shortcut-item">
                    <span>Zoom +</span>
                    <kbd>Molette</kbd>
                </div>
                <div class="shortcut-item">
                    <span>Zoom -</span>
                    <kbd>Molette</kbd>
                </div>
            </div>

            <div class="shortcut-category">
                <h3>Interface</h3>
                <div class="shortcut-item">
                    <span>Plein écran</span>
                    <kbd>F11</kbd>
                </div>
                <div class="shortcut-item">
                    <span>Menu raccourcis</span>
                    <kbd>Échap</kbd>
                </div>
            </div>
        </div>

        <div v-if="isMapping && mappingAction" class="mapping-overlay">
            Appuyez sur une touche pour mapper l'action "{{ getActionLabel(mappingAction) }}"
            <button @click="stopMapping" class="cancel-button">Annuler</button>
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

<style scoped>
.shortcuts-container {
    background-color: #1a1a1a;
    padding: 2rem;
    border-radius: 8px;
    color: white;
    max-width: 800px;
    width: 90%;
    display: grid;
    position: relative;
}

h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #fff;
}

.shortcuts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.shortcut-category {
    background-color: #2a2a2a;
    padding: 1.5rem;
    border-radius: 6px;
}

h3 {
    margin-bottom: 1rem;
    color: #fff;
    border-bottom: 1px solid #444;
    padding-bottom: 0.5rem;
}

.shortcut-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    background-color: #333;
    border-radius: 4px;
}

.shortcut-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.keys-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.key-wrapper {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

kbd {
    background-color: #444;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
    color: #fff;
}

button {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 0.8em;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.add-button {
    background-color: #4a4a4a;
    color: white;
    font-size: 1.2em;
    font-weight: bold;
}

.add-button:hover:not(:disabled) {
    background-color: #5a5a5a;
}

.unmap-button {
    background-color: #4a2a2a;
    color: white;
    font-size: 1.2em;
    font-weight: bold;
    padding: 0;
}

.unmap-button:hover:not(:disabled) {
    background-color: #5a3a3a;
}

.mapping-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.9);
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.cancel-button {
    background-color: #4a2a2a;
    color: white;
    padding: 0.5rem 1rem;
    align-self: center;
}

.cancel-button:hover {
    background-color: #5a3a3a;
}
</style>
