import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        include: ['./lib/**/*.spec.ts'],
        deps: {
            inline: [/@dimforge\/rapier3d-compat/],
        },
    },
    resolve: {
        alias: {
            '~': resolve(__dirname, './lib'),
            '~/lib': resolve(__dirname, './lib'),
        },
    },
    optimizeDeps: {
        exclude: ['@dimforge/rapier3d-compat'],
    },
    ssr: {
        noExternal: ['@dimforge/rapier3d-compat'],
    },
});
