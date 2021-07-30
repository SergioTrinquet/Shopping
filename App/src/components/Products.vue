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
      <div class="noProducts" v-if="products.length == 0">Aucun produit trouvé,<br/>désolé :-(</div>
  </div>
</template>

<script>
const Product = () => import(/* webpackChunkName: "Product" */ '@/components/Product')

import { mapState } from 'vuex' 

export default {
	name: 'Products',

	components: {
		Product
	},

	computed: {
    ...mapState([
      'products', 
      'basket'
    ])
	}

}
</script>

<style scoped>
.container {
  border-top: dotted 1px #cecece;
  padding: 10px;
}
.containerProductItems {
  /*display: flex;
  flex-wrap: wrap;*/
  
  /* Version avec grid */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}
.productItem {
  /*width: 30%;
  min-width: 180px;
  margin: 10px;*/
  max-width: 230px;
  background-color: #e6e6e6;
  padding: 10px;
  margin: 5px;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
}
.productItem.ordered {
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  background-color: #d7d7dd;
}
.noProducts {
  text-align: center;
  margin: 30px;
  font-size: 20px;
  line-height: 28px;
  color: #274d80;
}
</style>