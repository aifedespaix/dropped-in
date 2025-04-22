import { defineStore } from 'pinia'
import { GameEngine } from '~/lib/core/GameEngine';

export const useGameStore = defineStore('game', () => {
    const isInitialized = ref(false);
    const gameEngine = shallowRef<GameEngine | null>(null);

    function initGameEngine(container: HTMLElement) {
        if (isInitialized.value) {
            return;
        }

        const engine = new GameEngine(container);
        engine.init();
        isInitialized.value = true;
        gameEngine.value = engine;
    }

    return {
        isInitialized,
        gameEngine,
        initGameEngine
    }
})
