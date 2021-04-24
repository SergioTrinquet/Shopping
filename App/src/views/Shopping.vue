<template>
  <div>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <DepartmentsMargin v-if="displayMarginDepartments" /> -->
    <DepartmentsMargin />
    <BasketMargin />

    <div class="grid-container">
      <div class="block-filters">
        <Filters />
      </div>
      <div class="block-countAndOrderBy">
        <ProductsCountAndOrderBy />
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
const ProductsCountAndOrderBy = () => import(/* webpackChunkName: "ProductsCountAndOrderBy" */ '@/components/ProductsCountAndOrderBy')
const BasketMargin = () => import(/* webpackChunkName: "BasketMargin" */ '@/components/BasketMargin')

export default {
  name: 'Shopping',

  components: {
    DepartmentsMargin,
    Filters,
    Products,
    ProductsCountAndOrderBy,
    BasketMargin
  },

  computed: {
    displayMarginDepartments() {
      return this.$store.state.display_margin_departments;
    },
  },

  mounted() {
    // Chargement liste des rayons
    this.$store.dispatch('setDepartments');
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "Filters CountAndOrderBy"
    "Filters Products";
}
.block-filters { grid-area: Filters; }
.block-countAndOrderBy { grid-area: CountAndOrderBy; }
.block-products { grid-area: Products; }
</style>
