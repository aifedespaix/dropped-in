import {
    createLocalFontProcessor,
} from '@unocss/preset-web-fonts/local'
import {
    defineConfig,
    presetAttributify,
    presetWebFonts, presetWind3, transformerDirectives, transformerVariantGroup
} from 'unocss'

export default defineConfig({
    shortcuts: {
        'font-default': 'font-sans',
    },
    presets: [
        presetWind3(),
        presetAttributify(),
        presetWebFonts({
            fonts: {
                sans: 'DM Sans',
                serif: 'DM Serif Display',
                mono: 'DM Mono',
            },
            processors: createLocalFontProcessor(),
        }),
    ],
    theme: {
        colors: {
            primary: '#023E8A',
            secondary: '#00B4D8',
        }
    },
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
    // ...UnoCSS options
})