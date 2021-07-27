<template>
  <div class="container">

    <div class="lgn">
      <div>{{ nb_products }} résultat{{ nb_products > 1 ? "s" : "" }}</div>
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
}
.lgn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>