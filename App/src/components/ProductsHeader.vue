<template>
  <div class="container">

    <div class="lgn">
      <div class="nbResults tertiary-txt">{{ nb_products }} résultat{{ nb_products > 1 ? "s" : "" }}</div>
      <ProductsSelectOrder v-if="nb_products > 1" />
    </div>

    <div class="rayonProduits" v-if="!!selected_department_name">
      Produits du rayon <b class="secondary-txt">"{{ selected_department_name }}"</b>
    </div>
 
    <FiltersListTags v-if="filters_presence" />
    
  </div>
</template>

<script>
const FiltersListTags = () => import(/* webpackChunkName: "FiltersListTags" */ '@/components/FiltersListTags')
const ProductsSelectOrder = () => import(/* webpackChunkName: "ProductsSelectOrder" */ '@/components/ProductsSelectOrder')

import { mapState } from 'vuex'

export default {
    name: 'ProductsHeader',

    components: {
      FiltersListTags,
      ProductsSelectOrder
    },

    computed: {
      ...mapState({
        products: 'products',
        nb_products: state => state.products.length,
        selected_department_name: state => {
          const selectedDpt = state.selected_department;
          return selectedDpt !== null ? selectedDpt.intitule : ""; 
        },
        filters_presence: state => state.filters_query_string_parameters.length > 0
      })
    }
}
</script>

<style scoped>
.container {
  padding: 10px 20px;
}
.rayonProduits {
  font-size: 17px;
  /* font-size: clamp(13px, 4vw, 17px); */ /* Version non IOS compatible */
  font-size: max(13px, min(4vw, 17px)); /* Version IOS compatible */
}
.lgn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nbResults {
  font-weight: bold;
}

#app[data-narrow-screen] .container {
  padding: 10px 0;
}
#app[data-narrow-screen] .lgn {
  flex-direction: column-reverse;
}
#app[data-narrow-screen] .nbResults {
  margin-top: 6px;
}
#app[data-narrow-screen] .rayonProduits {
  text-align: center;
}
</style>