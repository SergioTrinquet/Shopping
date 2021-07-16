<template>
  <div>
    <DepartmentsMargin v-if="displayMarginDepartments" />

    <BasketMargin v-if="displayMarginBasket" />
    
    <!-- {{displayProductsInterface}} --><!-- TEST -->

    <div class="center" v-if="!displayProductsInterface">
      <div class="accueilTexte">Bienvenue sur mon appli de courses en ligne!</div>
      <img 
        src="../assets/imgs/illustration_undraw_shopping_app.svg" 
        alt="Bienvenue sur mon appli de courses en ligne!" 
        class="accueilSVG" 
      />
    </div>

    <div class="grid-container" v-else>
      <div class="block-filters">
        <Filters v-if="Object.keys(filters).length > 0" />
      </div>
      <div class="block-header">
        <ProductsHeader />
      </div>
      <div class="block-products">
        <Products />
      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
// Le composants suivants ne seront pas chargés directement mais scindés de 'app.js' et chargés 
// de manière asynchrone après coup en tache de fond (lazy loading + code splitting)
const DepartmentsMargin = () => import(/* webpackChunkName: "DepartmentsMargin" */ '@/components/DepartmentsMargin')
const BasketMargin = () => import(/* webpackChunkName: "BasketMargin" */ '@/components/BasketMargin')
const Filters = () => import(/* webpackChunkName: "Filters" */ '@/components/Filters')
const ProductsHeader = () => import(/* webpackChunkName: "ProductsHeader" */ '@/components/ProductsHeader')
const Products = () => import(/* webpackChunkName: "Products" */ '@/components/Products')

export default {
  name: 'Shopping',

  components: {
    DepartmentsMargin,
    Filters,
    Products,
    ProductsHeader,
    BasketMargin
  },

  computed: {
    displayMarginDepartments() {
      return this.$store.state.display_margin_departments;
    },
    displayMarginBasket() {
      return this.$store.state.display_margin_basket;
    },
    filters() {
      return this.$store.state.filters;
    },
    displayProductsInterface() {
      const flagSearchProducts = Object.keys(this.$store.state.search_products_type).length > 0 ? true : false;
      const productsFound = this.$store.state.products.length > 0 ? true : false;
      return flagSearchProducts || productsFound;
    }
  }

}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 250px 1fr; /* grid-template-columns: minmax(250px, 250px) 1fr; */
  grid-template-rows: auto 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "Filters Header"
    "Filters Products";
}
.block-filters { grid-area: Filters; }
.block-header { grid-area: Header; }
.block-products { grid-area: Products; }

.block-filters { 
  background-color: #F0F0F0;
  box-sizing: border-box;
  padding: 10px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  position: fixed;
  /* z-index: -1; */ /* Pour laisser l'autocomplete au dessus */
  width: 250px;
}

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
