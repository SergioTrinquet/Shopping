<template>
  <div class="container">

    <div class="rayonProduits">
      Produits du rayon <b class="secondary-txt">"{{ selected_department_name }}"</b>
    </div>
    
    <!-- <FiltersListTags v-if="!!filters_presence" /> --><FiltersListTags />

    <div class="lgn2">
      <div>{{ products.length }} résultat{{ products.length > 1 ? "s" : "" }}</div>
      <ProductsSelectOrder />
    </div>
    
  </div>
</template>

<script>

const FiltersListTags = () => import(/* webpackChunkName: "FiltersListTags" */ '@/components/FiltersListTags')
import ProductsSelectOrder from '@/components/ProductsSelectOrder'

export default {
    name: 'ProductsHeader',

    components: {
      FiltersListTags,
      ProductsSelectOrder
    },

    computed: {
      products() {
        return this.$store.state.products;
      },
      selected_department_name() {
        return this.$store.state.selected_department.intitule;
      },
      
      /* filters_presence() {
          return this.$store.state.filters_query_string_parameters.length;
      } */
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
.lgn2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>