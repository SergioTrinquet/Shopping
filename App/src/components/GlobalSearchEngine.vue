<template>
    <div id="searchEngine">
        <!-- <input 
            type="text" 
            class="mainInputSearch" 
            placeholder="Rechercher un produit par son nom, sa marque,..."
            @keypress.enter="searchProducts"
            @keyup="searchProducts"
        > -->
        <input 
            type="text" 
            class="mainInputSearch" 
            placeholder="Rechercher un produit par son nom, sa marque,..."
            @keyup="searchProducts"
        >
        <font-awesome-icon icon="search" id="iconSearch" />

        <transition name="autocomplete">
          <div 
            id="proposals" 
            class="proposals primary-txt" 
            v-if="displaySearchEngineResults"
          >
            <div class="lgnProduit legende">
              <div class="intituleProduit">Intitule produit</div>
              <div class="marqueProduit">Marque</div>
            </div>
            <div class="lgnProduit" 
              v-for="result in autocompleteResults" :key="result._id"
              @click="displayProduct(result._id)"
            >
              <div class="intituleProduit" v-html="highlight(result, 'intitule')"></div>
              <div class="marqueProduit" v-html="highlight(result, 'marque')"></div>
            </div>
            <!-- {{ autocompleteResults }} -->
          </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'GlobalSearchEngine',

    data() {
        return {
          old_saisie: "",
          timer: null,
          displaySearchEngineResults: false
        }
    },

    computed: {
      autocompleteResults() {
        return this.$store.state.autocompleteResults;
      }
    },

    watch: {
      autocompleteResults(val) {
        this.displaySearchEngineResults = val.length > 0 ? true : false;
      }
    },

    methods: {
      searchProducts(e) {   
        //console.log("event", e.type); //TEST
        const new_saisie = e.target.value.trim();

        // Appel action qd saisie differente de la dernière pour eviter appel inutile
        if(new_saisie.localeCompare(this.old_saisie) != 0) {
          if(new_saisie == "") {
            this.$store.commit("SET_AUTOCOMPLETE_RESULTS", []);
          } else {
            // Pour limiter le nbr de requetes : Déclenchement action 200ms après frappe et suppression de l'appel si nvelle frappe a lieu avant ce délai de 200ms
            clearTimeout(this.timer); // Suppression des évènements 'keyup' précédent 
            this.timer = setTimeout(() => this.$store.dispatch('fetchProductsForAutocompleteSearchEngine', new_saisie), 200); // Déclenchement action après 200ms
          }
        }
        
        this.old_saisie = new_saisie;
      },


      highlight(val, champ) {
        const goodPath = val.highlight.filter(p => p.path == champ)[0];
        
        if(!!goodPath == false) {
          return val[champ];
        } else {
          let txt = "";
          goodPath.texts.forEach(str => {
            if(str.type == "hit") {
              txt += `<i ${this.$options._scopeId}>${str.value}</i>` // Ici 'this.$options._scopeId' correspond à l'attribut rajouté par Vue.js pour scoper le CSS. Ajouté car autrement CSS ds la partie 'style' ne fonctionnera pas
            } else {
              txt += str.value
            }
          });
          return txt;
        }
      },

      displayProduct(id) {
        this.$store.dispatch('fetchProductFromAutocompleteSearchEngine', id);
      }
    },


    mounted() {
      // Pour fermer la liste des propositions qd click ailleurs que dessus ou bien sur moteur de recherche
      window.addEventListener("click", (e) => {
        // S'il y a des résultats ET que click event sur le moteur de rech. ou ses sélecteurs enfants OU la liste de proposition...
        if(
            this.autocompleteResults.length > 0 
            && 
            (
              e.target.id == "proposals" || 
              e.target.id == "searchEngine" || Array.from(document.querySelector("#searchEngine").children).includes(e.target) 
            )
          ) 
        {
          this.displaySearchEngineResults = true;
        } else {
          this.displaySearchEngineResults = false;
        }
      })
    }
    
}
</script>

<style scoped>
#searchEngine {
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
  border-radius: 4px;
  margin: 30px 0 0 -8px;
  padding: 4px 10px;
  box-shadow: 0 0 3px rgba(0,0,0,0.6);
  background-color: #fff;
}

#proposals .lgnProduit {
  display: flex;
  font-size: 14px;
  padding: 3px;

  border-bottom: dotted 1px #254A7B;
}
#proposals .lgnProduit:last-child {
  border-bottom-width: 0;
}
#proposals .lgnProduit:not(.legende):hover {
  background-color: rgba(48,93,154, 0.05);
  cursor: pointer;
}
#proposals .lgnProduit > div {
  flex-grow: 1;
  flex-basis: 0;
}
#proposals .lgnProduit.legende {  
  font-style: italic;
  font-size: 13px;

  border-bottom: solid 1px #254A7B;
}
#proposals .lgnProduit i {
    font-style: normal;
    padding: 0 3px;

    background-color: rgb(255, 255, 0);
    /* background-color: pink; */
}


.autocomplete-enter,
.autocomplete-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
.autocomplete-enter-active,
.autocomplete-leave-active {
  transition: all 0.25s ease-out;
}
</style>