<template>
  <div>

    <div 
      class="grid-container" 
      :class="hiddenMarginFilters ? 'hideMarginFilters' : ''"
    >
      <div 
        class="block-filters" 
        :class="displayMarginFilters ? '' : 'closed'"
      >

        <div 
          id="BtFilters" 
          v-if="Object.keys(filters).length > 0" 
          @click="toggleMarginFilters"
        >
          <font-awesome-icon 
            :icon="filtersButton.icon" 
            :id="filtersButton.idIcon" 
            :class="filtersButton.classIcon"
          />
          <div class="libelle">{{ filtersButton.libelle }}</div>
        </div>

        <Filters v-if="Object.keys(filters).length > 0" />

      </div>

      <app-overlay
        :display="displayMarginFilters"
        @click.native="toggleMarginFilters"
      />

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

import { mapState } from 'vuex'

export default {
  name: 'Shopping',

  components: {
    Filters,
    Products,
    ProductsHeader
  },

  data() {
      return {
        displayMarginFilters: false,
        hiddenMarginFilters: true //
      }
  },

  computed: {
    ...mapState([
      'filters',
      'is_narrow_screen'
    ]),
    displayProductsInterface() {
      const flagSearchProducts = Object.keys(this.$store.state.search_products_type).length > 0 || this.$route.params.fromSearchEngine;
      const productsFound = this.$store.state.products.length > 0;
      return flagSearchProducts || productsFound;
    },
    filtersButton() {
        return {
          icon: this.displayMarginFilters ? "times" : "filter",
          idIcon: this.displayMarginFilters ? 'iconClose' : 'iconFilter',
          classIcon: this.displayMarginFilters ? 'tertiary-txt_hover' : '',
          libelle: this.displayMarginFilters ? 'Fermer' : 'Filtres'
        }
      }
  },

  watch: {
    // Si largeur écran > 481px, fermeture marge Filtres + overlay qui va avec
    is_narrow_screen: { 
        immediate: true,
        handler(val) {
          this.displayMarginFilters = false;
          this.hiddenMarginFilters = (Object.keys(this.filters).length == 0 && val) ? true : false;
        }
    },
    filters(val) {
        this.hiddenMarginFilters = (Object.keys(val).length == 0 && this.is_narrow_screen) ? true : false;
    }
  },

  methods: {
    toggleMarginFilters() {
      this.displayMarginFilters = !this.displayMarginFilters;
    }
  },


  mounted() { 
    // Si pas de recherche de faite ou pas de produits trouvés: retour à la page d'accueil
    if(!this.displayProductsInterface)  this.$router.push({ name: 'Accueil' });
  }

}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: var(--widthMarginFilters) 1fr; /* grid-template-columns: minmax(var(--widthMarginFilters), var(--widthMarginFilters)) 1fr; */
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
  width: var(--widthMarginFilters);
  transition: all 0.3s ease-in-out;
}

#BtFilters { display: none; }

#app[data-narrow-screen] .grid-container {
  grid-template-columns: 10px 1fr; /* grid-template-columns: minmax(var(--widthMarginFilters), var(--widthMarginFilters)) 1fr; */
}
#app[data-narrow-screen] .block-filters {
  border-right: solid 1px #2b558d;
}
#app[data-narrow-screen] .block-filters:not(.closed) {
  z-index: 1001;
}
#app[data-narrow-screen] .block-filters.closed {
  margin-left: calc((var(--widthMarginFilters) * -1) + 8px);
  z-index: 1;
}
#app[data-narrow-screen] .grid-container.hideMarginFilters {
  grid-template-columns: 0 1fr;
}
#app[data-narrow-screen] .grid-container.hideMarginFilters .block-filters {
  margin-left: calc((var(--widthMarginFilters) * -1));
}

#app[data-narrow-screen] #BtFilters {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  font-size: 20px;
  background-color: #F0F0F0;
  border: solid 1px #2b558d;
  border-left-width: 0;
  position: fixed;
  margin-left: calc(var(--widthMarginFilters) - 12px);
  margin-top: 20px;
  cursor: pointer;
  border-radius: 0px 8px 8px 0;
  transition: all 0.3s ease;
}
#app[data-narrow-screen] #BtFilters:hover {
  box-shadow: 5px 0 8px rgba(0,0,0,0.25);
}
#app[data-narrow-screen] #BtFilters .libelle {
  font-size: 12px;
  font-weight: bold;
  line-height: 12px;
  margin: 3px 0 0 0;
}
  #app[data-narrow-screen] #BtFilters #iconClose {
    position: unset;
  }

/******* Surcharge du style pour CSS se trouvant ds composant enfant 'Product.vue' malgré le "scoped" grace à ">>>" *******/
#app[data-narrow-screen] .block-products >>> .product {
    position: relative;
    justify-content: flex-start;
}
#app[data-narrow-screen] .block-products >>> .illustration {
    position: absolute;
    width: 40%;
}
#app[data-narrow-screen] .block-products >>> .intitule,
#app[data-narrow-screen] .block-products >>> .marque,
#app[data-narrow-screen] .block-products >>> .bloc,
#app[data-narrow-screen] .block-products >>> .origine,
#app[data-narrow-screen] .block-products >>> .promotion,
#app[data-narrow-screen] .block-products >>> .label_nutriscore {
    margin: 0 0 0 44%;
    order: 0;
}

#app[data-narrow-screen] .block-products >>> .bloc {
    padding: 3px 0;
}
#app[data-narrow-screen] .block-products >>> .intitule {
    font-size: 16px;
    line-height: 14px;
    padding: 0 0 3px 0;
    min-height: 42px;
}
#app[data-narrow-screen] .block-products >>> .marque {
    font-size: 15px;
    line-height: 15px;
    padding: 4px 0;
}    
#app[data-narrow-screen] .block-products >>> .origine {
    font-size: 13px;
    padding: 1px 0;
}
#app[data-narrow-screen] .block-products >>> .prix {
    font-size: 21px;
}
#app[data-narrow-screen] .block-products >>> .promotion {
    order: 1; 
    margin: 0; 
    padding: 5px 0 0 0;
}
#app[data-narrow-screen] .block-products >>> .bottom { 
    order: 2;
    margin: 0;
}
/******* FIN Surcharge *******/
</style>
