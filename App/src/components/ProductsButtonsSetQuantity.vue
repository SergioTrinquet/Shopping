<template>
  <div class="setQuantity secondary-border">
      <button @click="less">-</button>
      <div>{{ dataProduct.quantity }}</div>
      <button @click="more">+</button>
  </div>
</template>

<script>
export default {
    name: 'ProductsButtonsSetQuantity',

    props: {
        dataProduct: {
            type: Object,
            required: true
        },
    },

    methods: {
        less() {
            // Envoi au composant parent de la quantité sélectionnée
            this.$emit('event-set-quantity', this.dataProduct.quantity -= 1);
        },
        more() {
            // Envoi au composant parent de la quantité sélectionnée
            this.$emit('event-set-quantity', this.dataProduct.quantity += 1);
        }
    }
}
</script>

<style scoped>
.setQuantity {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background-color: #fff;
    border-radius: 4px;
    width: 90px;
    float: right;
}
.setQuantity > * {
    flex-grow: 1;
    flex-basis: auto;
}
.setQuantity > button {
    font-weight: bold;
    border-width: 0;
    background-color: transparent;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.2s ease-in-out;
    width: calc((90px - 35px) / 2);
}
.setQuantity > button:hover {
    background-color: #82c91e;
    color: #fff;
}
.setQuantity > div {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    min-width: 35px;
}
</style>