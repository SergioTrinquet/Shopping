<template>
  <div 
    id="app" 
    :data-narrow-screen="narrowScreen"
  >

    <AppLoader :loading="loading" v-if="loading" /><!-- Loader général -->
    <AppErrorMsg :message="dataError" v-if="dataError != null" /><!-- Encart msg d'erreur général -->

    <div id="nav">
      <div id="MenuRayons" class="secondary hover" @click="marginDepartments">
        <font-awesome-icon icon="bars" />
        <span>Rayons</span>
      </div>

      <div id="nomApp">
        <font-awesome-icon icon="shopping-cart" />
        <router-link to="/"><span class="titreApp">Mes courses en ligne</span></router-link>
      </div>

      <div>
        <SearchEngine />
      </div>

      <div class="accountIcon disabled" title="Option pas encore disponible"><!-- Pas encore opérationnel mais en projet -->
          <font-awesome-icon icon="user" />
          <span>Compte</span>
      </div>

      <div class="listsIcon disabled" title="Option pas encore disponible"><!-- Pas encore opérationnel mais en projet -->
          <font-awesome-icon icon="heart" />
          <span>Listes</span>
      </div>

      <div class="basketIcon" @click="marginBasket">
          <IndicateurNbItems v-if="basketNbItems > 0" />
          <font-awesome-icon icon="shopping-basket" />
          <BasketPrice />
      </div>
    </div>

    <DepartmentsMargin v-if="displayMarginDepartments" />
    <BasketMargin v-if="displayMarginBasket" />

    <div id="content">
      <router-view/>
    </div>

  </div>
</template>

<script>
  import AppLoader from '@/components/base/AppLoader'
  const AppErrorMsg = () => import(/* webpackChunkName: "EncartMsgErreur" */ '@/components/base/AppError')
  import SearchEngine from '@/components/SearchEngine'
  const IndicateurNbItems = () => import(/* webpackChunkName: "IndicateurNbItems" */ '@/components/BasketIndicateurNbItems')
  import BasketPrice from '@/components/BasketPrice'
  const DepartmentsMargin = () => import(/* webpackChunkName: "DepartmentsMargin" */ '@/components/DepartmentsMargin')
  const BasketMargin = () => import(/* webpackChunkName: "BasketMargin" */ '@/components/BasketMargin')

  import { mapState } from 'vuex'

  export default {
    components: {
      AppLoader,
      AppErrorMsg,
      SearchEngine,
      IndicateurNbItems,
      BasketPrice,
      DepartmentsMargin, 
      BasketMargin
    },

    data() {
      return {
        narrowScreen: false
      }
    },

    computed: {
      ...mapState({
        loading: state => state.loading > 0,
        dataError: 'data_error',
        displayMarginDepartments: 'display_margin_departments',
        displayMarginBasket: 'display_margin_basket',
        limitNarrowScreen: 'limit_narrow_screen'
      }),
      basketNbItems() {
        return this.$store.getters.getBasketNbItems;
      }
    },


    methods: {
      marginDepartments() {
        this.$store.commit("SET_DISPLAY_MARGIN_DEPARTMENTS", !this.displayMarginDepartments);
      },
      marginBasket() {
        this.$store.commit("SET_DISPLAY_MARGIN_BASKET", !this.displayMarginBasket);
      },
      // Si largeur écran > 481px, fermeture marge Filtres + overlay qui va avec
      setNarrowScreenDatavalue() {
        this.narrowScreen = window.matchMedia(`(min-width: ${this.limitNarrowScreen + 1}px)`).matches ? false : true;
      }
    },

    mounted() {
      // Exec fct° qd resize
      window.addEventListener('resize', this.setNarrowScreenDatavalue);
      this.setNarrowScreenDatavalue();
    }
  }
</script>

<style>
#app {
  /* font-family: 'Baloo 2', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50; */

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "navigation"
    "content";
}

#nav { grid-area: navigation; }
#content { grid-area: content; }

#nav {
  position: fixed;
  z-index:100;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: rgb(48,93,154);
  background: linear-gradient(0deg, rgba(48,93,154,1) 0%, rgba(24,49,83,1) 100%);
  color: #fff;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#nav > div:nth-child(2) {
  flex-direction: row !important;
  margin: 0 0 0 10px;
}
#nav > div:nth-child(3) {
  flex-grow: 3;
}
#nav > div:not(:nth-child(3)) {
  display: flex;
  align-items: center;
  flex-direction: column;
}
#nav > div:last-child {
  margin: 0 10px 0 0;
}

#nav a,
#nav .accountIcon,
#nav .basketIcon,
#nav .listsIcon {
  cursor: pointer;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  display: inline-block;
  padding: 0 0 0 14px;
  line-height: 17px;
  min-width: 45px;
  position: relative;
}
@media screen and (max-width: 700px) {
  #nav .accountIcon,
  #nav .listsIcon,
  #nomApp {
    display: none !important;
  }
}

#app[data-narrow-screen] #nav .basketIcon { padding: 0; }

#nav a.router-link-exact-active {
  color: #42b983;
}

#nav #MenuRayons {
  padding: 9px 10px;
  align-self: stretch; /* Pour prendre tte la hauteur */
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

#nav svg {
  font-size: 24px;
}
#nav svg + span {
  display: block;
  font-size: 12px;
}

#nav .titreApp {
  display: inline-block;
  width: 90px;
  text-align: left;
}

.disabled {
  opacity: 0.5; 
  cursor: not-allowed;
}
</style>
