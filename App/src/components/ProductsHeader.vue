<template>
  <div class="container">

    <div class="lgn">
      <div>{{ Nb_products }} résultat{{ Nb_products > 1 ? "s" : "" }}</div>
      <ProductsSelectOrder v-show="Nb_products > 1" />
    </div>

    <div class="rayonProduits" v-if="!!selected_department_name">
      Produits du rayon <b class="secondary-txt">"{{ selected_department_name }}"</b>
    </div>
 
    <FiltersListTags v-if="filters_presence" />
    
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
      Nb_products() {
        return this.products.length;
      },
      selected_department_name() {
        if(this.$store.state.selected_department !== null) {
          return this.$store.state.selected_department.intitule;
        } else {
          return "";
        }
        //return this.$store.state.selected_department.intitule;
      },
      filters_presence() {
          return this.$store.state.filters_query_string_parameters.length > 0;
      }
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