import { defineStore } from 'pinia'
import { GameEngine } from '~/game/core/GameEngine';

export const useGameStore = defineStore('game', () => {
    const isInitialized = ref(false);
    const gameEngine = shallowRef<GameEngine | null>(null);

    const isGameStarted = ref(false);

    async function initGameEngine(container: HTMLElement) {
        if (isInitialized.value) {
            return;
        }

        const engine = new GameEngine(container);
        await engine.load();
        isInitialized.value = true;
        gameEngine.value = engine;
    }

    function play() {
        if (!gameEngine.value) {
            throw new Error('Game engine not initialized');
        }
        if (gameEngine.value.isInitialized) {
            gameEngine.value.resume();
        } else {
            gameEngine.value.start();
        }
        isGameStarted.value = true;
    }

    function stop() {
        gameEngine.value?.pause();
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
