<template>
    <div 
        class="overlay"  
        :class="{'display': display, 'top': onTop}"
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
        },
        onTop: {
            type: Boolean
        }
    }
}
</script>

<style scoped>
    .overlay {
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0);
        width: 0;
        height: 100%;
    }
    .overlay.display {
        width: 100%;
        background-color: rgba(0, 0, 0, 0.50);
    }
    .overlay.top {
        z-index: 1001;
    }
</style>