<template>
    <div class="searchEngine">
        <input 
            type="text" 
            class="mainInputSearch" 
            placeholder="Rechercher un produit par son nom, sa marque,..."
        >
        <font-awesome-icon icon="search" id="iconSearch" @click="TEST()" />
        <div id="proposals">gzrgzrg</div>
    </div>
</template>

<script>
export default {
    name: 'GlobalSearchEngine',

    data() {
        return {

        }
    },
    methods: {
      TEST() {
        console.log("On a cliqué !!!"); //TEST
      }
    }
}
</script>

<style scoped>
.searchEngine {
  position: relative;
  display: inline-block;
  width: 80%;
  text-align: left;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  padding: 8px;
}

.mainInputSearch {
  border: 0;
  background: none;
  width: calc(100% - 30px);
  box-sizing: border-box;
  padding: 5px 3px;
  height: 100%;
  display: inline-block;
}
.mainInputSearch:focus {
  outline: none;
}

#iconSearch {
  color: #1DAAF4;
  position: absolute;
  z-index: 1;
  cursor: pointer;
  margin: 0px 0 0px 4px;
}
#iconSearch:hover {
  color: rgb(24, 136, 196);
}

#proposals {
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  background-color: #1DAAF4;
  color: #fff;
  border-radius: 4px;
  margin: 30px 0 0 -8px;
  padding: 10px;
  display: none;
}
</style>