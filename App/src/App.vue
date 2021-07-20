<template>
  <div id="app">

    <AppLoader :loading="loading" v-if="loading" /><!-- Loader général -->
    <AppErrorMsg :message="dataError" v-if="dataError != null" /><!-- Encart msg d'erreur général -->

    <div id="nav">
      <div id="MenuRayons" class="secondary" @click="marginDepartments">
        <font-awesome-icon icon="bars" />
        <span>Rayons</span>
      </div>

      <div>
        <font-awesome-icon icon="shopping-cart" />
        <router-link to="/"><span class="titreApp">Mes courses en ligne</span></router-link>
      </div>

      <div>
        <SearchEngine />
      </div>

      <div>
        <router-link to="/myBasket">
          <font-awesome-icon icon="heart" />
          <span>Listes</span>
        </router-link>
      </div>

      <div class="basketIcon" @click="marginBasket">
        <!-- <router-link to="/myBasket"> -->
          <IndicateurNbItems v-if="basketNbItems > 0" />
          <font-awesome-icon icon="shopping-basket" />
          <BasketPrice />
        <!-- </router-link> -->
      </div>
    </div>


    <div id="content">    <span style="color: red; position: fixed; top: 10px; left: 80px; width: 200px; background-color: yellow; font-size: 11px;">{{search_products_type}}</span>
      <router-view/>
    </div>

  </div>
</template>

<script>
  import AppLoader from '@/components/base/AppLoader'
  const AppErrorMsg = () => import(/* webpackChunkName: "EncartMsgErreur" */ '@/components/base/AppError');
  import SearchEngine from '@/components/SearchEngine'
  const IndicateurNbItems = () => import(/* webpackChunkName: "IndicateurNbItems" */ '@/components/base/AppIndicateurNbItems')
  import BasketPrice from '@/components/BasketPrice'

  export default {
    components: {
      AppLoader,
      AppErrorMsg,
      SearchEngine,
      IndicateurNbItems,
      BasketPrice
    },

    computed: {
      loading() {
        return this.$store.state.loading;
      },
      dataError() {
        return this.$store.state.data_error;
      },
      displayMarginDepartments() {
        return this.$store.state.display_margin_departments;
      },
      displayMarginBasket() {
        return this.$store.state.display_margin_basket;
      },
      basketNbItems() {
        return this.$store.getters.getBasketNbItems;
      },
      componentsOpen() {
          return this.$store.getters.areComponentsOpen;
      },


      //// A VIRER ////
      search_products_type() { return this.$store.state.search_products_type }
      //// A VIRER ////
    },


    methods: {
      marginDepartments() {
        this.closeOtherComponents();
        this.$store.commit("SET_DISPLAY_MARGIN_DEPARTMENTS", !this.displayMarginDepartments);
      },
      marginBasket() {
        this.closeOtherComponents();
        this.$store.commit("SET_DISPLAY_MARGIN_BASKET", !this.displayMarginBasket);
      },
      // Pour fermer ts les composants pouvant être ouverts
      closeOtherComponents() {
        if(this.componentsOpen) {
          this.$store.dispatch("closeComponents");
        }
      }
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
#nav .basketIcon {
  cursor: pointer;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  display: inline-block;
  padding: 0 0 0 20px;
  line-height: 17px;
  min-width: 45px;
  position: relative;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#nav #MenuRayons {
  padding: 9px 10px;
  align-self: stretch; /* Pour prendre tte la hauteur */
  cursor: pointer;
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
</style>
