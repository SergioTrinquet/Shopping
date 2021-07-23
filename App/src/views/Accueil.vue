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

export default {
    components: {
        ValidationOrderModal
    },

    data() {
        return {
            displayMsgValidationCommande: false
        }
    },

    methods: {
        closeModal() {
            this.displayMsgValidationCommande = false;
        }
    },

    created() {
        if(this.$route.params.validatedOrder) {
            this.displayMsgValidationCommande = true;
        }
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