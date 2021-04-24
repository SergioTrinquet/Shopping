<template>
    <div 
        class="overlay"  
        :class="display ? 'display' : ''"
    >
        <slot />
    </div>
</template>

<script>
export default {
    name: 'Overlay',

    props: {
        display: {
            type: Boolean,
            required: true
        }
    }
}
</script>

<style scoped>
    .overlay {
        position: fixed;
        z-index: 1000;
        background-color: rgba(0, 0, 0, 0);
        width: 0;
        height: 100%;
    }
    .overlay.display {
        width: 100%;
        background-color: rgba(0, 0, 0, 0.50);
    }
</style>