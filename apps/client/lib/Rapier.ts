export class RapierModule {
    private static instance: typeof import('@dimforge/rapier3d-compat') | null = null;

    static async get(): Promise<typeof import('@dimforge/rapier3d-compat')> {
        if (!this.instance) {
            const rapier = await import('@dimforge/rapier3d-compat');
            await rapier.init();
            this.instance = rapier;
        }
        return this.instance;
    }

    static isReady(): boolean {
        return !!this.instance;
    }
}
