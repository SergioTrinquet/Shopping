<template>
    <div>   <!-- {{ dataProduct }} -->
        <div class="intitule primary-txt">{{ dataProduct.intitule }}</div>
        <div class="marque" v-if="dataProduct.marque != ''">{{ dataProduct.marque }}</div>
        <div class="bloc">
            <div class="descriptif">{{ dataProduct.descriptif }}</div>
            <div class="prixUnite">{{ dataProduct.prix_unite }} € / {{ dataProduct.unite }}</div>
        </div>
        <img alt="photo" :src="require('@/assets/imgs/' + dataProduct.nom_image + '.jpg')" class="illustration" />
        <!-- <img alt="photo" :src="require(dataProduct.imgPath)" class="illustration" /> -->
        <div class="origine" v-if="dataProduct.origine != ''">Origine: {{ dataProduct.origine }}</div>
        <div class="promotion tertiary-txt">{{ promotion(dataProduct._id) }}</div>
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

        , promotion() {
            return this.$store.getters.getPromotion;
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
    line-height: 18px;
    text-transform: capitalize;
}
.marque {
    font-weight: bold;
    color: rgb(37, 44, 122, 0.7);
}
.bloc {
    margin: 6px 0 10px 0;
    line-height: 14px;
}
.descriptif,
.prixUnite {
    font-size: 14px;
}

.prix {
    font-weight: bold;
    font-size: 22px;
}

.origine {
    font-size: 14px;
    font-style: italic;
}
.promotion {
    font-size: 13px;
    font-weight: bold;
    background-color: #fded69;
    display: inline-block;
    padding: 0 3px;
}

.bottom {
    display: flex;
    justify-content: space-between;
}

.illustration {
    width: 100%;
}
</style>