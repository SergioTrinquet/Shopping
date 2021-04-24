<template>
    <div>
        <div>
            <span class="intitule primary-txt">{{ dataProduct.intitule }}</span>
            <span class="marque" v-if="dataProduct.marque != null"> - {{ dataProduct.marque }}</span>
        </div>
        <div class="descriptif">{{ dataProduct.descriptif }}</div>
        <div class="prixUnite">{{ dataProduct.prix_unite }} € / {{ dataProduct.unite }}</div>
        <img alt="photo" :src="'../assets/imgs/' + dataProduct.nom_image + '.jpg'" class="illustration" />
        <div class="origine">Origine: {{ dataProduct.origine }}</div>
        <div class="bottom">
            <div class="prix tertiary-txt">{{ dataProduct.prix }} €</div>
            <!-- NOTE :  Si 'dataProduct.id' se trouve dans 'basket', on récupère sa quantité -->
            <!-- <component 
                :is="typeof basket[dataProduct.id] != 'undefined' ? 'buttonsSetQuantity' : 'buttonAddToBasket'"
                :dataProduct="basket[dataProduct.id] || dataProduct.id"
                @event-set-quantity="displayGoodComponent($event)"
            /> -->
            <component 
                :is="typeof basket[dataProduct.id] != 'undefined' ? 'buttonsSetQuantity' : 'buttonAddToBasket'"
                :dataProduct="{ id: dataProduct.id, quantity: typeof basket[dataProduct.id] != 'undefined' ? basket[dataProduct.id].qte : 0 }"
                @event-set-quantity="displayGoodComponent($event)"
            />
        </div>
    </div>
</template>

<script>
import buttonAddToBasket from '@/components/ProductsButtonAddToBasket'
import buttonsSetQuantity from '@/components/ProductsButtonsSetQuantity'

export default {
    name: 'Product',
    
    components: {
        buttonAddToBasket,
        buttonsSetQuantity
    },

    props: {
        dataProduct: {
            type: Object,
            required: true
        }
    },

    computed: {
        basket() {
            return this.$store.state.basket;
        }
    },

    methods: {
        displayGoodComponent(data) {
            console.log("Quantité commandée", data); //TEST
            // Enregistrement de la quantité saisie dans Panier
            this.$store.commit('SET_QUANTITY_TO_BASKET', {produit: this.dataProduct, quantite: data.qte});
        }
    }
    
}
</script>

<style scoped>
.intitule {
    font-weight: bold;
    font-size: 20px;
    text-transform: capitalize;
}
.descriptif,
.prixUnite {
    font-size: 14px;
    line-height: 17px;
}

.prix {
    font-weight: bold;
    font-size: 22px;
}

.origine {
    font-style: italic;
}

.bottom {
    display: flex;
    justify-content: space-between;
}
</style>