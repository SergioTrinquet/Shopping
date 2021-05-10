<template>
  <div id="filtersWrapper">
      <div>FILTRES</div>
      <div>
        <input type="checkbox" id="chbxPromos">
        <label for="chbxPromos">N'affichez que les promotions</label>
      </div>
      <div>
        <input type="text" placeholder="filtrer par marque" />
        <div v-for="(marque, idx) in filters.marques" :key="idx">
          <input type="checkbox" :id="idx">
          <label :for="idx">{{ marque }}</label>
        </div>
      </div>
      <div>
        <div>Nutriscore</div>
        <div v-for="score in filters.nutriscore" :key="score._id">
          <input type="checkbox" :id="score._id">
          <label :for="score._id">{{ score.lettre }}</label>
        </div>
      </div>
      <div>
        <!-- Labels qualité -->
        <!-- <div v-for="(marque, idx) in filters.marques" :key="idx">
          <input type="checkbox" :id="idx">
          <label :for="idx">{{ marque }}</label>
        </div> -->
      </div>
  </div>
</template>

<script>
export default {
  computed: {
    filters() {
      return this.$store.state.filters;
    }
  },

  mounted() {
      // Chargement des filtres
      this.$store.dispatch("setFilters");
  }
}
</script>

<style>
#filtersWrapper > div {
  border-bottom: dashed 1px #9f9f9f;
  padding: 8px 0;
}
#filtersWrapper > div:last-child {
  border-bottom-width: 0;
}
</style>