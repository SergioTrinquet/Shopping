<template>
    <span>
        <span v-if="basketNbItems == 0">Panier</span>
        <span v-else>{{ basketTotalPrice }}€</span>
    </span>
</template>

<script>
export default {
    name: "BasketPrice",

    computed: {
        basketNbItems() {
            return this.$store.getters.getBasketNbItems;
        },
        basketTotalPrice() {
            return this.$store.getters.getBasketTotalPrice;
        }
    }
}
</script>