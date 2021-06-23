<template>
    <div class="product">   <!-- {{ dataProduct }} -->
        <div class="intitule primary-txt">{{ dataProduct.intitule }}</div>
        <div class="marque" v-if="!!dataProduct.marque">{{ dataProduct.marque }}</div>
        <div class="bloc">
            <div class="descriptif">{{ dataProduct.descriptif }}</div>
            <div class="prixUnite">{{ dataProduct.prix_unite.toFixed(2) }}€ / {{ dataProduct.unite }}</div>
        </div>
        <img alt="photo" :src="require('@/assets/imgs/produits/' + dataProduct.nom_image + '.jpg')" class="illustration" /> <!-- Faire un computed pour gérer cas ou img n'existe pas. On afficherait alors une img par défaut -->
        <!-- <img alt="photo" :src="publicPath + dataProduct.nom_image + '.jpg'" class="illustration" /> -->
        <!-- <img alt="photo" :src="require(dataProduct.imgPath)" class="illustration" /> -->
        <div class="origine">
            <span v-if="!!dataProduct.origine">
                <span>Origine: {{ dataProduct.origine }}</span>
                <span v-if="dataProduct.origine.toUpperCase() == 'FRANCE'" class="frenchFlag"></span>
            </span>
        </div>
        <div class="promotion tertiary-txt">
            <span v-if="libellePromotion">{{ libellePromotion }}</span>
        </div>
        <div class="label_nutriscore">
            <div class="labels">
                <div    
                    v-for="lb in dataProduct.label_qualite" :key="lb._id" 
                    :class="lb._id"
                    :data-tooltip="`label ${lb.label}`"
                ></div>
            </div>
            <div 
                v-if="!!dataProduct.nutriscore"
                :class="['nutriscore', dataProduct.nutriscore.lettre]"
                data-tooltip="nutriscore"
            ></div>
        </div>
        <div class="bottom">     
            <div>   
                <div v-if="isDiscount" class="prix tertiary-txt">{{ dataProduct.prix_reduc.toFixed(2) }}€</div>
                <div :class="isDiscount ? 'prixAvantDiscount' : 'prix tertiary-txt'">{{ dataProduct.prix.toFixed(2) }}€</div>
            </div>
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

    /*data () {
        return {
            publicPath: process.env.BASE_URL
        }
    },*/

    computed: {
        basket() {
            return this.$store.state.basket;
        },

        // Génère texte pour promo s'il y en a
        libellePromotion() {
            let libelle = "";
            const prd = this.dataProduct;
            if("promotion" in prd && prd.promotion !== null) {
                libelle = prd.promotion.pourcent ? 
                            `PROMO: -${prd.promotion.info}%` : 
                            prd.promotion.info;
            }
            return libelle;
        },
        
        isDiscount() {
            return ("prix_reduc" in this.dataProduct ? true : false);
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
.product {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: flex-end;
}
.intitule {
    flex-grow: 1;
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
.prixAvantDiscount {
    font-size: 14px;
    text-decoration: line-through;
    position: absolute;
    margin: -13px 0 0 0;
}

.origine {
    margin: 3px 0 0 0;
    font-size: 14px;
    font-style: italic;
    min-height: 22px;
}
.origine > span {
    display: flex;
    align-items: center;
}
.frenchFlag {
    display: inline-block;
    height: 14px;
    width: 30px;
    background: 50% 50% url('../assets/imgs/flag-origine-FR.svg') no-repeat;
}
.promotion {
    font-size: 13px;
    font-weight: bold;
    min-height: 22px;
    padding: 3px 0;
}
.promotion > span {
    padding: 0 3px;
    background-color: #fded69;
}

.label_nutriscore {
    display: flex;
    justify-content: space-between;
    margin: 3px 0 8px 0;
    height: 25px;
}
.labels > div {
    width: 25px;
    height: 25px;
    margin: 0 5px 0 0;
}
.labels > div:hover::before,
.nutriscore:hover::before {
    content: attr(data-tooltip);
    position: absolute;
    background-color: #2c3e50;
    color: #fff;
    font-size: 13px;
    padding: 2px 5px;
    border-radius: 3px;
}
.labels > div:hover::before {
    margin: 33px 0 0 0;
}
.labels > .lb_1 {
    background: 50% 50% url('../assets/imgs/labels/flag-label-bio.svg') no-repeat;
}
.labels > .lb_2 {
    background: 50% 50% url('../assets/imgs/labels/flag-label-ecolabel.svg') no-repeat;
}
.labels > .lb_3 {
    background: 50% 50% url('../assets/imgs/labels/flag-label-labelrouge.svg') no-repeat;
}
.labels > .lb_4 {
    background: 50% 50% url('../assets/imgs/labels/flag-label-commerce-equitable.svg') no-repeat;
}
.labels > .lb_5 {
    background: 50% 50% url('../assets/imgs/labels/flag-label-aop.svg') no-repeat;
}

.nutriscore {
    flex-basis: 40%;
}
.nutriscore:hover::before {
    margin: 33px 0 0 0;
}
.nutriscore.A {
    background: 100% 50% url('../assets/imgs/nutriscore/flag-nutriscore-A.svg') no-repeat;
}
.nutriscore.B {
    background: 100% 50% url('../assets/imgs/nutriscore/flag-nutriscore-B.svg') no-repeat;
}
.nutriscore.C {
    background: 100% 50% url('../assets/imgs/nutriscore/flag-nutriscore-C.svg') no-repeat;
}
.nutriscore.D {
    background: 100% 50% url('../assets/imgs/nutriscore/flag-nutriscore-D.svg') no-repeat;
}
.nutriscore.E {
    background: 100% 50% url('../assets/imgs/nutriscore/flag-nutriscore-E.svg') no-repeat;
}

.bottom {
    display: flex;
    justify-content: space-between;
    margin: 5px 0 0 0;
}

.illustration {
    width: 100%;
}
</style>