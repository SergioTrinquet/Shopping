<template>
  <app-overlay :display="loading" class="overlay">
      <font-awesome-icon icon="circle-notch" spin />
  </app-overlay>
</template>

<script>
export default {
    name: 'Loader',
    
    props: {
        loading: {
            type: Boolean,
            required: true
        }
    }
}
</script>

<style scoped>
.overlay > svg {
    font-size: 50px;
    position: absolute;
    color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>