<template>
  <div class="wrapper">
    <div>{{ products.length }} résultat{{ products.length > 1 ? "s" : "" }}</div>
    <div>
      <select name="" id="" ></select>
    </div>
  </div>
</template>

<script>
export default {
    name: 'CountAndOrderBy',

    computed: {
      products() {
        return this.$store.state.products;
      }
    },
}
</script>

<style>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>