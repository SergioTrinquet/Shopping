<template>
    <app-overlay 
        :display="displayMarginBasket" 
        @click.native="closeMarge"
        class="addTransition"
    >
<!-- <transition name="ESSAI"> --><!-- TEST -->
        <div id="marge">
            <div class="marge_top">
                <div class="header primary-light">
                    <span>Aperçu panier</span>
                    <span><font-awesome-icon icon="times" id="close" class="tertiary-txt_hover" @click="closeMargeFromButton" /></span>
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
            <div class="marge_bottom primary">eerze</div>
        </div>
<!-- </transition> --><!-- TEST -->
    </app-overlay>
</template>

<script>
import Product from '@/components/Product'

export default {
    name: 'BasketMargin',

    components: {
        Product
    },

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
        }
    },

    methods: {
        // Pour fermer la marge listant rayons qd click en dehors de celle-ci
        closeMarge(e) {
            if(e.target.className.includes('addTransition')) {
                this.$store.commit("SET_DISPLAY_MARGIN_BASKET", false);
            }
        },

        closeMargeFromButton(e) {
            this.$store.commit("SET_DISPLAY_MARGIN_BASKET", false);
            e.stopPropagation(); // Sinon execution après de la méthode 'closeMarge' car appelée sur click sur DOM parent
        }
    }

}
</script>

<style scoped>
    /* Surcharge possible sur class '.overlay' présente dans composant enfant 'app-overlay', alors que pas utilisée ici !! */
    /* .overlay { */
    .addTransition {
        transition: background-color 0.5s ease-in-out;
    }

    #marge {
        position: fixed;
        z-index: 2;
        margin: 0;
        right: -360px;
        width: 360px;
        height: calc(100% - 60px);
        background-color: #f5f5f5;
        transition: right 0.3s ease-in-out;
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }
    /* Sélecteur utilisant class qui sont décarées ds composant enfant */
    .overlay.display #marge {
        right: 0;
    }
    .marge_top {
        padding: 10px 10px 0 10px;
    }
    .marge_middle {
        overflow-y: auto;
        flex-grow: 1; /* Pour prendre tt l'espace restant par rapport aux autres bloc column */
        padding: 0 10px 10px 10px;
    }
    .marge_bottom {
        padding: 10px;
        color: #fff;
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

    #close {
        cursor: pointer;
        font-size: 20px;
        position: absolute;
        margin: 2px 0 0 -13px;
        transition: transform 0.3s ease-in-out;
    }
    #close:hover {
        transform: rotate(180deg);
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



    /* ESSAI POUR TRANSITION */
    .ESSAI-enter-active, .ESSAI-leave-active {
        transition: right .5s ease-in-out;
    }
    .ESSAI-enter, .ESSAI-leave-to /* .fade-leave-active below version 2.1.8 */ {
        right: 0;
    }
    /* FIN */
</style>