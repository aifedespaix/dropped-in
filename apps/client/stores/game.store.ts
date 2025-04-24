import { defineStore } from 'pinia'
import { GameEngine } from '~/lib/core/GameEngine';

export const useGameStore = defineStore('game', () => {
    const isInitialized = ref(false);
    const gameEngine = shallowRef<GameEngine | null>(null);

    const isGameStarted = ref(false);

    function initGameEngine(container: HTMLElement) {
        if (isInitialized.value) {
            return;
        }

        const engine = new GameEngine(container);
        engine.init();
        isInitialized.value = true;
        gameEngine.value = engine;
    }

    function play() {
        gameEngine.value?.start();
        isGameStarted.value = true;
    }

    function stop() {
        gameEngine.value?.stop();
        isGameStarted.value = false;
    }

    return {
        isInitialized,
        gameEngine,
        initGameEngine,
        play,
        stop
    }
})
