<template>
  <div class="container">

    <!-- <FiltersListTags v-if="!!filters_presence" /> --><FiltersListTags />

    <div class="lgn">
      <div>{{ products.length }} résultat{{ products.length > 1 ? "s" : "" }}</div>
      <ProductsSelectOrder />
    </div>

    <div class="rayonProduits" v-if="!!selected_department_name">
      Produits du rayon <b class="secondary-txt">"{{ selected_department_name }}"</b>
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
.lgn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>