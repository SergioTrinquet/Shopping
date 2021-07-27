<template>
    <span>
        <span v-if="basketNbItems == 0">Panier</span>
        <span v-else>{{ basketTotalPrice }}€</span>
    </span>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: "BasketPrice",

    computed: {
        ...mapGetters({
            basketNbItems: 'getBasketNbItems',
            basketTotalPrice: 'getBasketTotalPrice'
        })
    }
}
</script>