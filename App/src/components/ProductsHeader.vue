<template>
  <div class="container">

    <div class="rayonProduits">
      Produits du rayon <b class="secondary-txt">"{{ selected_department_name }}"</b>
    </div>

    
    <FiltersListTags />

    <div class="lgn2">
      <div>{{ products.length }} résultat{{ products.length > 1 ? "s" : "" }}</div>
      <div>
        Trier par :
        <select>
          <option 
            v-for="(typeTri, idx) in listeTypeTri" :key="idx" 
            :value="typeTri.champBdd"
          >
            {{ typeTri.texte }}
          </option>
        </select>
      </div>
    </div>
    
  </div>
</template>

<script>
import FiltersListTags from '@/components/FiltersListTags'


export default {
    name: 'ProductsHeader',

    components: {
      FiltersListTags
    },

    computed: {
      products() {
        return this.$store.state.products;
      },
      selected_department_name() {
        return this.$store.state.selected_department.intitule;
      },
      listeTypeTri() {
        return this.$store.state.listeTypeTri;
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
.lgn2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>