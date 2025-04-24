type LoopCallback = (dt: number) => void;

export class RenderLoop {
    private lastTime = 0;
    private accumulator = 0;
    private frameDuration: number;
    private running = false;
    private boundLoop: FrameRequestCallback;

    constructor(
        private readonly update: LoopCallback,
        private readonly render: () => void,
        private readonly targetFPS = 60
    ) {
        this.frameDuration = 1000 / this.targetFPS;
        this.boundLoop = this.loop.bind(this);
    }

    start(): void {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.boundLoop);
    }

    stop(): void {
        this.running = false;
    }

    private loop(currentTime: number): void {
        const delta = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.accumulator += delta;

        if (this.accumulator >= this.frameDuration) {
            const dtSeconds = this.frameDuration / 1000;
            this.update(dtSeconds);
            this.render();
            this.accumulator -= this.frameDuration;
        }

        if (this.running) {
            requestAnimationFrame(this.boundLoop);
        }
    }
}
