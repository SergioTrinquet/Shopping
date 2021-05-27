<template>
  <div class="container">
      <div class="containerProductItems">
          <!-- Liste Produits -->
          <div 
            v-for="produit in products" :key="produit._id" 
            class="productItem" 
            :class="typeof basket[produit._id] != 'undefined' ? 'ordered' : ''"
          >
            <Product :dataProduct="produit" />
          </div>
      </div>
  </div>
</template>

<script>
import Product from '@/components/Product'

export default {
  name: 'Products',

  components: {
    Product
  },

  computed: {
    products() {
      return this.$store.state.products;
    },
    basket() {
      return this.$store.state.basket;
    }
  },

  watch: {
    // Pour fermer la marge listant rayons juste après clic sur un de ces rayons
    products() {
      this.$store.commit("SET_DISPLAY_MARGIN_DEPARTMENTS", false);
    }
  }

}
</script>

<style scoped>
.container {
  border-top: dotted 1px #cecece;
  padding: 10px;
}
.containerProductItems {
  display: flex;
  flex-wrap: wrap;
}
.productItem {
  width: 30%;
  min-width: 180px;
  max-width: 230px;
  background-color: #e6e6e6;
  padding: 10px;
  margin: 10px;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
}
.productItem.ordered {
  /* border: dotted 1px #2A538A; */
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}
</style>