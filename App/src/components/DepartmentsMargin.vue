<template>          
    <transition name="fade" appear>
        <app-overlay 
            :display="displayMarginDepartments" 
            @click.native="closeMarge"
            data-overlay="true"
        >
            <div id="marge" @click="stopPropagation">
                <div class="marge_top">
                    <div class="header secondary">Rayons</div>   
                </div>
                <div>
                    <div 
                        class="rayon"
                        v-for="department in departments" 
                        :key="department._id"
                        @click="displayDataDepartment(department)"
                    >
                        <span class="primary-txt">{{ department.intitule | uppercase }}</span>
                        <font-awesome-icon icon="chevron-right" class="secondary-txt" />
                    </div>
                </div>
            </div>
        </app-overlay>
    </transition>
</template>

<script>
import uppercase from '@/filters/uppercase'
import stopPropagation from '@/mixins/stopPropagation'
import clearSearchEngine from '@/mixins/clearSearchEngine'

import { mapState } from 'vuex'

export default {
    name: 'DepartmentsMargin',

    filters: { uppercase },

    mixins: [ stopPropagation, clearSearchEngine ],

    computed: {
        ...mapState({
            displayMarginDepartments: 'display_margin_departments',
            departments: 'departments',
            products: 'products'
        })
    },

    watch: {
        // Pour fermer la marge listant rayons juste après clic sur un de ces rayons
        products() {
            this.$store.commit("SET_DISPLAY_MARGIN_DEPARTMENTS", false);
        }
    },

    methods: {
        displayDataDepartment(dept) {
            // Redirection vers pg de présentation des produits si besoin            
            if(this.$route.name !== 'Shopping') this.$router.push({ name: 'Shopping' });
            
            // Retrait saisie ds champ de rech. et l'autocomplete si présent 
            this.clearSearch();

            // Affectation 'selected_department' pour enregistrer le rayon sélectionné
            this.$store.commit('SET_SELECTED_DEPARTMENT', { id: dept._id, intitule: dept.intitule });
            
            // Commit du paramètre pour construction de la queryString qui sera passée coté backend via l'action 'fetchProducts' qui suit
            // On indique par la même occasion par quel moyen on recherche des produits (par rayon, ou par recherche ds le moteur)
            this.$store.commit('SET_TYPE_OF_SEARCH_PRODUCTS', { 'rayon': dept._id });

            // Appel API pour récup. des produits du rayon sélectionné
            this.$store.dispatch('fetchProducts');

            // Récup. filtres présents ds produits du rayon sélectionné
            this.$store.dispatch('setFilters');
        },

        // Pour fermer la marge listant rayons qd click en dehors de celle-ci
        closeMarge(e) {
            if(e.target.querySelectorAll('[data-overlay]')) {
                this.$store.commit("SET_DISPLAY_MARGIN_DEPARTMENTS", false);
            }
        }
    },

    mounted() {
        if(this.departments.length == 0) {
            // Chargement liste des rayons
            this.$store.dispatch('setDepartments');
        }
    }
}
</script>

<style scoped>
    #marge {
        left: 0;
        width: 300px;
        margin-left: 0;
        overflow-y: auto;
    }

    .marge_top {
        padding: 10px;
    }
    .header {
        font-weight: bold;
        padding: 5px 10px;
        color: #fff;
    }

    .rayon {
        padding: 10px;
        border-top: dotted 1px #747474;
        text-align: left;
        position: relative;
        cursor: pointer;
    }
    .rayon:first-child {
        border-top-width: 0;
    }

    .rayon svg {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translate(50%, -50%);
        transition: transform 0.2s ease-in-out;
    }
    .rayon:hover svg {
        transform: translate(100%, -50%);
    }

    .rayon > span:before {
        content: "";
        background: rgba(130,201,30, 0.2);
        width: 0%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        transition: width 0.3s ease-in-out;
    }
    .rayon:hover > span:before {
        width: 100%;
    }


    /* transition overlay */
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s ease-in-out;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
        background-color: rgba(0, 0, 0, 0);
    }
    /* transition marge dans overlay */
    .fade-enter-active #marge, .fade-leave-active #marge {
        transition: margin-left 0.3s ease-in-out;
    }
    .fade-enter #marge, .fade-leave-to #marge {
        margin-left: -300px;
    }
</style>