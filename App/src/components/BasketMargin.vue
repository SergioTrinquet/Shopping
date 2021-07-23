<template>
    <transition name="fade" appear>
        <app-overlay 
            :display="displayMarginBasket" 
            @click.native="closeMarge"
            data-overlay="true"
        >
            <div id="marge" @click="stopPropagation">
                <div class="marge_top">
                    <div class="header primary-light">
                        <span>Aperçu panier</span>
                        <span>
                            <font-awesome-icon 
                                icon="times" 
                                id="iconClose" 
                                class="tertiary-txt_hover" 
                                @click="closeMargeFromButton" 
                            />
                        </span>
                    </div>      
                    <div class="nbItems">{{ displayNbItems }}</div>
                </div>
                <div class="marge_middle">
                    <div
                        v-for="item in basketSortedByDepartment" 
                        :key="item.prod.id"
                        class="items"
                    >
                        <div class="department_title secondary-txt">{{ item.dept }}</div>
                        <div v-for="product in item.prod" :key="product.id" class="blocProduct">
                            <Product :dataProduct="product" />
                        </div>             
                    </div>
                </div>
                <div class="marge_bottom">

                    <div class="TotalWrapper tertiary-txt">
                        <span class="libelle">Total:</span>
                        <span class="somme">{{ basketTotalPrice }}</span>
                    </div>
                    <button 
                        class="btValidationOrder secondary tertiary_hover"
                        :disabled="basketNbItems == 0"
                        @click="validationOrder"
                    >
                        Valider la commande
                    </button>
                </div>
            </div>
        </app-overlay>
    </transition>
</template>

<script>
const Product = () => import(/* webpackChunkName: "Product" */ '@/components/Product')
import stopPropagation from '@/mixins/stopPropagation'

export default {
    name: 'BasketMargin',

    components: {
        Product
    },

    mixins: [ stopPropagation ],

    computed: {
        displayMarginBasket() {
            return this.$store.state.display_margin_basket;
        },
        basketNbItems() {
            return this.$store.getters.getBasketNbItems;
        },
        displayNbItems() {
            return (this.basketNbItems == 0 ? "Aucun article pour le moment" : this.basketNbItems + " article" + (this.basketNbItems > 1 ? "s" : "" ));
        },
        basketSortedByDepartment() {   
            return this.$store.getters.getBasketSortedByDepartment;
        },
        basketTotalPrice() {
            return this.$store.getters.getBasketTotalPrice;
        }
    },

    methods: {
        // Pour fermer la marge listant les articles du panier qd click en dehors de celle-ci
        closeMarge(e) {
            if(e.target.querySelectorAll('[data-overlay]')) {
                this.$store.commit("SET_DISPLAY_MARGIN_BASKET", false);
            }
        },

        closeMargeFromButton(e) {
            this.$store.commit("SET_DISPLAY_MARGIN_BASKET", false);
            e.stopPropagation(); // Sinon execution après de la méthode 'closeMarge' car appelée sur click sur DOM parent
        },

        validationOrder() {
            let c = confirm("Confirmez votre validation svp.");
            if(c) {
                // On supprime les articles du panier
                this.$store.commit("REMOVE_BASKET");
                // Fermeture marge panier
                this.$store.commit("SET_DISPLAY_MARGIN_BASKET", false);
                // Renvoi sur pg d'accueil avec paramètre pour apparition encart de confirmation de commande
                this.$router.push({ name: 'Accueil', params: { validatedOrder: true } });
            }
        }
    }

}
</script>

<style scoped>
    #marge {
        right: -360px;     right: 0; 
        width: 360px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }
    .marge_top {
        padding: 10px 10px 0 10px;
    }
    .marge_middle {
        overflow-y: auto;
        flex-grow: 1; /* Pour prendre tt l'espace restant par rapport aux autres bloc column */
        padding: 0 10px 10px 10px;
        box-sizing: border-box;
        border: dotted 1px #b3c7e3;
        border-left-width: 0;
        border-right-width: 0;
    }
    .marge_bottom {
        padding: 8px;
        display: flex;
        justify-content: space-between;
    }

    .header {
        font-weight: bold;
        margin: 0 0 5px 0;
        padding: 5px 10px;
        display: flex;
    }
    .header > span {
        flex-basis: 50%;
    }
    .header > span:last-child {
        text-align: right;
    }

    #iconClose {
        font-size: 20px;
        margin: 2px 0 0 -13px;
    }

    .department_title {
        font-weight: bold;
        border-bottom: solid 1px rgb(37, 44, 122);
    }

    .nbItems {
        text-align: center;
        font-weight: bold;
        font-size: 15px;
    }

    .blocProduct {
        padding: 8px;
        background-color: #e6e6e6;
        margin: 10px 0;
    }

    .TotalWrapper {
        font-weight: bold;
        line-height: 17px;
    }
    .TotalWrapper .libelle {
        font-size: 13px;
        display: block;
    }
    .TotalWrapper .somme {
        font-size: 22px;
    }
    .TotalWrapper .somme:after {
        content: "€";
    }

    .btValidationOrder {
        width: 60%;
        border: solid 2px rgba(255, 255, 255, 0.6);
        padding: 2px;
        border-radius: 4px;
        color: #fff;
        font-weight: bold;
        font-family: 'Baloo 2', cursive;
        font-size: 17px;
        cursor: pointer;
        transition: background-color 0.3s ease-in-out;
    }
    .btValidationOrder:disabled {
        opacity: 0.5;
        pointer-events: none;
    }


    /******* Surcharge du style pour CSS se trouvant ds composant enfant 'Product.vue' malgré le "scoped" grace à ">>>" *******/
    .items >>> .trashIcon {
        display: block;
        padding: 0 0 0px 6px;
        transition: color 0.2s ease-in-out;
    }
    .items >>> .product {
        position: relative;
        justify-content: flex-start;
    }
    .items >>> .illustration {
        position: absolute;
        width: 40%;
    }
    .items >>> .intitule,
    .items >>> .marque,
    .items >>> .bloc,
    .items >>> .origine,
    .items >>> .promotion,
    .items >>> .label_nutriscore {
        margin: 0 0 0 44%;
        order: 0;
    }

    .items >>> .bloc {
        padding: 3px 0;
    }
    .items >>> .intitule {
        font-size: 16px;
        line-height: 14px;
        padding: 0 0 3px 0;
    }
    .items >>> .marque {
        font-size: 15px;
        line-height: 15px;
        padding: 4px 0;
    }    
    .items >>> .origine {
        font-size: 13px;
        padding: 1px 0;
    }
    .items >>> .prix {
        font-size: 21px;
    }
    .items >>> .promotion {
        order: 1; 
        margin: 0; 
        padding: 5px 0 0 0;
    }
    .items >>> .bottom { 
        order: 2;
        margin: 0;
    }
    /******* FIN Surcharge *******/


    /* transition overlay */
    .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease-in-out;
    }
    .fade-enter, .fade-leave-to {
    opacity: 0;
    }
    /* transition marge dans overlay */
    .fade-enter-active #marge, .fade-leave-active #marge {
        transition: right 0.3s ease-in-out;
    }
    .fade-enter #marge, .fade-leave-to #marge {
        right: -360px;
    }

    /* V2 : transition marge dans overlay */
    /* #marge {
        animation: slide-right-to-left 0.5s ease-in-out;
    }
    .overlay.fade-leave-active #marge {
        animation: slide-left-to-right 0.5s ease-in-out;
    } 
    @keyframes slide-right-to-left {
        0% { right: -360px; }
        100% {  right: 0px; }
    }
    @keyframes slide-left-to-right {
        0% { right: 0px; }
        100% { right: -360px; }
    } */
</style>