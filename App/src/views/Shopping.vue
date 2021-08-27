<template>
  <div>
    <!-- {{displayProductsInterface}} --><!-- TEST -->

    <div class="grid-container">
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
const Filters = () => import(/* webpackChunkName: "Filters" */ '@/components/Filters')
const ProductsHeader = () => import(/* webpackChunkName: "ProductsHeader" */ '@/components/ProductsHeader')
const Products = () => import(/* webpackChunkName: "Products" */ '@/components/Products')

export default {
  name: 'Shopping',

  components: {
    Filters,
    Products,
    ProductsHeader
  },

  computed: {
    filters() {
      return this.$store.state.filters;
    },
    displayProductsInterface() {
      const flagSearchProducts = Object.keys(this.$store.state.search_products_type).length > 0 || this.$route.params.fromSearchEngine;
      const productsFound = this.$store.state.products.length > 0;
      return flagSearchProducts || productsFound;
    }
  },

  mounted() { 
    // Si pas de recherche de faite ou pas de produits trouvés: retour à la page d'accueil
    if(!this.displayProductsInterface)  this.$router.push({ name: 'Accueil' })
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
</style>
