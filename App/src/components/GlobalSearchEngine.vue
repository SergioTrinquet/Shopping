<template>
    <div class="searchEngine">
        <input 
            type="text" 
            class="mainInputSearch" 
            placeholder="Rechercher un produit par son nom, sa marque,..."
            @keypress.enter="searchProducts"
        >
        <font-awesome-icon icon="search" id="iconSearch" />
        <div id="proposals">gzrgzrg</div>
    </div>
</template>

<script>
export default {
    name: 'GlobalSearchEngine',

    data() {
        return {
          old_saisie: ""
        }
    },
    methods: {
      searchProducts(e) {
        const new_saisie = e.target.value.trim();
        //console.log("Saisie", new_saisie); //TEST

        // Appel action que :
          // - qd saisie differente de la dernière pour eviter appel inutile,
          // - Après 200ms
        if(new_saisie.localeCompare(this.old_saisie) != 0) {
          console.log("Saisie differente !!"); //TEST
          setTimeout(1000, )
        } else {
          console.log("MEME SAISIE"); //TEST
        }
        this.old_saisie = new_saisie;
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
  /* color: #1DAAF4; */
  color: #254879;
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