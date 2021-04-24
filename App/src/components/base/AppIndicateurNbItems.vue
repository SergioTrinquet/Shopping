<template>
  <div class="indicateurNbItems tertiary">
      <slot />
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.indicateurNbItems {
    position: absolute;
    right: 0;
    top: 0;
    margin: -3px -6px 0 0;
    border-radius: 50%;
    font-weight: bold;
    color: #fff;
    font-size: 13px;
    min-width: 19px;
}
</style>