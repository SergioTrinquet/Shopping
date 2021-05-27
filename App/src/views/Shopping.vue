<template>
  <div>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <DepartmentsMargin v-if="displayMarginDepartments" /> -->
    <DepartmentsMargin />
    <!-- <transition name="TESTtransition">
      <BasketMargin v-if="displayMarginBasket" />
    </transition> -->
    <BasketMargin />

    <div class="grid-container" v-if="selected_department != null">
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
const Filters = () => import(/* webpackChunkName: "Filters" */ '@/components/Filters')
const Products = () => import(/* webpackChunkName: "Products" */ '@/components/Products')
const ProductsHeader = () => import(/* webpackChunkName: "ProductsHeader" */ '@/components/ProductsHeader')
const BasketMargin = () => import(/* webpackChunkName: "BasketMargin" */ '@/components/BasketMargin')

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

    //TEST pour chargement à la volée qd demande ouverture marge
    displayMarginDepartments() {
      return this.$store.state.display_margin_departments;
    },
    displayMarginBasket() {
      return this.$store.state.display_margin_basket;
    }
    // FIN TEST

    , products() {
      return this.$store.state.products;
    },
    selected_department() {
      return this.$store.state.selected_department;
    },
    filters() {
      return this.$store.state.filters;
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
  width: 250px;
}



/* TEST transition */
.TESTtransition-enter-active, .TESTtransition-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.TESTtransition-enter, .TESTtransition-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
/* FIN TEST transition */
</style>
