<template>
  <div class="center">
      <validation-order-modal 
        v-if="displayMsgValidationCommande" 
        @event-close-modal="closeModal" 
      />

      <div class="accueilTexte">Bienvenue sur mon appli de courses en ligne!</div>
      <img 
        src="../assets/imgs/illustration_undraw_shopping_app.svg" 
        alt="Bienvenue sur mon appli de courses en ligne!" 
        class="accueilSVG" 
      />
    </div>
</template>

<script>
const ValidationOrderModal = () => import(/* webpackChunkName: "ValidationOrderModal" */ '@/components/ValidationOrderModal');
import clearSearchEngine from '@/mixins/clearSearchEngine'
import initFiltersAndSort from '@/mixins/initFiltersAndSort'

export default {
    components: {
        ValidationOrderModal
    },

    mixins: [ clearSearchEngine, initFiltersAndSort ],

    data() {
        return {
            displayMsgValidationCommande: false
        }
    },

    computed: {
      // Flag qd validation commande
      validationOrderCmd() {
        return this.$store.state.validation_order_cmd;
      }
    },

    watch: {
      validationOrderCmd: { 
        immediate: true,
        handler(val) {
          if(val) {
            // Apparition modal de validation de commande
            this.$store.commit('SET_VALIDATION_ORDER_CMD', false);
            this.displayMsgValidationCommande = true;
          }
        }
      }
    },

    methods: {
        closeModal() {
            this.displayMsgValidationCommande = false;
        }
    },

    mounted() { 
      // Réinitialisation chp de rech. + autocomplete
      this.clearSearch(); 

      // Réinitialisation de la plupart des prop. du state : Pas obligatoire mais logique et meilleure visibilité dans Vue devTools
      this.initFiltersAndSort(); // Réinitialisation var du state concernant Filtres et Tri
      this.$store.commit('SET_PRODUCTS', []);
      this.$store.commit('SET_TYPE_OF_SEARCH_PRODUCTS', {});
      this.$store.commit('SET_SELECTED_DEPARTMENT', null);
    }
}
</script>

<style>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px);
}
.accueilTexte {
  font-size: 3vw;
  line-height: 3.5vw;
  position: absolute;
  width: 40vw;
  min-width: 250px;
  max-width: 350px;
  text-align: center;
  margin: -30vh 0 0 0;
}
@media screen and (max-width: 600px) {
  .accueilTexte {
    font-size: 20px;
    line-height: 25px;
  }
}
@media screen and (min-width: 1000px) {
  .accueilTexte {
    font-size: 30px;
    line-height: 35px;
  }
}
.accueilSVG {
  width: 30vw;
  min-width: 250px;
  max-width: 350px;
}
</style>