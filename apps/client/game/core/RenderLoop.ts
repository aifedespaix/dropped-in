type LoopCallback = (dt: number) => void;

export class RenderLoop {
    #lastTime = 0;
    #accumulator = 0;
    #running = false;
    #targetFPS = 60;

    #updateFunction: LoopCallback;
    #boundLoop: FrameRequestCallback;
    #frameDuration: number;

    constructor(update: LoopCallback) {
        this.#updateFunction = update;
        this.#frameDuration = 1000 / this.#targetFPS;
        this.#boundLoop = this.#loop.bind(this);
    }

    start(): void {
        if (this.#running) return;
        this.#running = true;
        this.#lastTime = performance.now();
        requestAnimationFrame(this.#boundLoop);
    }

    pause(): void {
        this.#running = false;
    }

    stop(): void {
        this.#running = false;
    }

    #loop(currentTime: number): void {
        const delta = currentTime - this.#lastTime;
        this.#lastTime = currentTime;
        this.#accumulator += delta;

        if (this.#accumulator >= this.#frameDuration) {
            const dtSeconds = this.#frameDuration / 1000;
            this.#updateFunction(dtSeconds);
            this.#accumulator -= this.#frameDuration;
        }

        if (this.#running) {
            requestAnimationFrame(this.#boundLoop);
        }
    }
}
