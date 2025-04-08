<template>
    <button :class="[
        'border-none cursor-pointer',
        'relative overflow-hidden group px-6 py-3 rounded-lg font-medium transition-all duration-300',
        'hover:shadow-lg hover:scale-105 active:scale-95',
        buttonClasses
    ]" @click="$emit('click')">
        <span class="relative z-10">{{ text }}</span>
        <div
            class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left">
        </div>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    text: string
    variant?: 'primary' | 'secondary' | 'default'
}>()

defineEmits<{
    (e: 'click'): void
}>()

const buttonClasses = computed(() => {
    switch (props.variant) {
        case 'primary':
            return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
        case 'secondary':
            return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
        default:
            return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    }
})
</script>