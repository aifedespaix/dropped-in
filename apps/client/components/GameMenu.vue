<template>
    <div class="absolute inset-0 flex items-center justify-center z-50">
        <div class="bg-black/80 p-4 rounded-lg w-full max-w-md flex flex-col gap-2">
            <div class="text-white text-xl text-center font-bold">Main Menu</div>
            <OverlayMenuButton
                v-for="button in buttons"
                :key="button.label"
                @click="button.action"
                :type="button.type"
            >
                {{ button.label }}
            </OverlayMenuButton>
        </div>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['play', 'options']);

function play(e: MouseEvent) {
    emit('play', e);
}

function options(e: MouseEvent) {
    emit('options', e);
}

type Button = {
    label: string;
    action: (e: MouseEvent) => void;
    type: 'primary' | 'secondary';
}
const buttons: Button[] = [
    {
        label: 'Jouer',
        action: play,
        type: 'primary'
    },
    {
        label: 'Options',
        action: options,
        type: 'secondary'
    }

]
</script>