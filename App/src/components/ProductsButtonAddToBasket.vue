<template>
    <font-awesome-icon 
        icon="shopping-basket" 
        class="secondary hover" 
        @click="AddToBasket" 
    />
</template>

<script>
export default {
    name: 'ProductsButtonAddToBasket',

    props: {
        /* V1 */
        /* // Ici, 'dataProduct' est juste un id
        dataProduct: {
            type: String,
            required: true
        }, */

        /* V2 */
        dataProduct: {
            type: Object,
            required: true
        },
    },

    methods: {
        AddToBasket() {     //console.warn(">>>>>>>>>>", this.dataProduct); //TEST
            // Transfert donnée 'Quantity' au composant parent
            /* V1 */ //this.$emit('event-set-quantity', { id: this.dataProduct, qte: 1 });
            /* V2 */ this.$emit('event-set-quantity', { id: this.dataProduct.id, qte: 1 });
        }
    }
}
</script>

<style scoped>
svg {
    font-size: 22px;
    color: #fff;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    float: right;
    transition: all 0.3s ease-in-out;
}
</style>