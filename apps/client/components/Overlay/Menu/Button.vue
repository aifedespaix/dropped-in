<template>
    <button
        class="outline-none rounded-2xl w-full px-6 py-3"
        :class="colors"
        cursor="pointer"
        sm="w-auto"
        text="white lg"
        hover="shadow-lg scale-105"
        font="semibold"
        transition="all duration-200 ease-in-out"
        focus-visible="ring-2 ring-white ring-offset-2"
        @click="onClick"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
type ButtonType = 'primary' | 'secondary';

type Props = {
    onClick: (e: MouseEvent) => void;
    type?: ButtonType;
}
const props = withDefaults(defineProps<Props>(), {
    type: 'primary',
});

type TypeColor = { [K in ButtonType]: string[] }
const hover: TypeColor = {
    primary: ['bg-primary/80', 'hover:bg-primary/90'],
    secondary: ['bg-secondary/80', 'hover:bg-secondary/90'],
}

const bg: TypeColor = {
    primary: ['bg-primary'],
    secondary: ['bg-secondary'],
}

const active: TypeColor = {
    primary: ['bg-primary/60'],
    secondary: ['bg-secondary/60'],
}

const colors = computed(() => {
    const classes = []
    classes.push(...bg[props.type]);
    classes.push(...hover[props.type].map(value => 'hover:' + value));
    classes.push(...active[props.type].map(value => 'active:' + value));
    return classes.join(' ');
})



</script>