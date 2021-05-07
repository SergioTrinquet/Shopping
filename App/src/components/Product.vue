<template>
    <div>   <!-- {{ dataProduct }} -->
        <div>
            <span class="intitule primary-txt">{{ dataProduct.intitule }}</span>
            <span class="marque" v-if="dataProduct.marque != '-'"> - {{ dataProduct.marque }}</span>
        </div>
        <div class="descriptif">{{ dataProduct.descriptif }}</div>
        <div class="prixUnite">{{ dataProduct.prix_unite }} € / {{ dataProduct.unite }}</div>
        <img alt="photo" :src="require('../assets/imgs/' + dataProduct.nom_image + '.jpg')" class="illustration" />
        <!-- <img alt="photo" :src="require(dataProduct.imgPath)" class="illustration" /> -->
        <div class="origine">Origine: {{ dataProduct.origine }}</div>
        <div class="bottom">
            <div class="prix tertiary-txt">{{ dataProduct.prix }} €</div>
            <!-- NOTE :  Si 'dataProduct._id' se trouve dans 'basket', on récupère sa quantité -->
            <!-- <component 
                :is="typeof basket[dataProduct._id] != 'undefined' ? 'buttonsSetQuantity' : 'buttonAddToBasket'"
                :dataProduct="basket[dataProduct._id] || dataProduct._id"
                @event-set-quantity="displayGoodComponent($event)"
            /> -->
            <component 
                :is="typeof basket[dataProduct._id] != 'undefined' ? 'buttonsSetQuantity' : 'buttonAddToBasket'"
                :dataProduct="{ id: dataProduct._id, quantity: typeof basket[dataProduct._id] != 'undefined' ? basket[dataProduct._id].qte : 0 }"
                @event-set-quantity="displayGoodComponent($event)"
            />
            <!-- {{ basket[dataProduct._id].qte }} -->
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
        displayGoodComponent(qte) {
            console.log("Quantité commandée", qte); //TEST
            // Enregistrement de la quantité saisie dans Panier
            this.$store.commit('SET_QUANTITY_TO_BASKET', {produit: this.dataProduct, quantite: qte});
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

.illustration {
    width: 100%;
}
</style>