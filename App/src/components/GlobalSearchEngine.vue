<template>
    <div id="searchEngine">
        <input 
            type="text" 
            class="mainInputSearch" 
            placeholder="Rechercher un produit par son nom ou sa marque"
            @click="closeMargins"
            @keyup="searchProductsForAutocomplete"
            @keypress.enter="searchProducts"
        >
        <font-awesome-icon 
            icon="backspace" 
            id="iconBackspace" 
            @click="clearSearch" 
            v-if="displayIconClearSearch" 
        />
        <font-awesome-icon 
            icon="search" 
            id="iconSearch" 
            @click="searchProducts"
        />

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
          displaySearchEngineResults: false,
          displayIconClearSearch: false
        }
    },

    computed: {
      autocompleteResults() {
        return this.$store.state.autocompleteResults;
      },
      componentsOpen() {
        return this.$store.getters.areComponentsOpen;
      }
    },

    watch: {
      autocompleteResults(val) {
        this.displaySearchEngineResults = val.length > 0 ? true : false;
      }
    },

    methods: {
      searchProductsForAutocomplete(e) {   
        //console.log("event", e.type); //TEST
        const new_saisie = e.target.value.trim();

        // Pour afficher ou non icone de suppress° du texte ds moteur de recherche
        this.setDisplayIconClearSearch(new_saisie);

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


      clearSearch() {
        const newValue = "";
        document.querySelector('.mainInputSearch').value = newValue;
        this.setDisplayIconClearSearch(newValue);
        this.$store.commit('SET_AUTOCOMPLETE_RESULTS', []); // disparit° autocomplete en vidant son contenu
      },

      
      setDisplayIconClearSearch(inputValue) {
        this.displayIconClearSearch = inputValue.length > 0 ? true : false;
      },


      closeMargins() {
        if(this.componentsOpen) {
          this.$store.dispatch("closeComponents");
        }
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

      // Qd click sur un produit ds l'autocomplete
      displayProduct(id) {
        this.$store.dispatch('fetchProductFromAutocompleteSearchEngine', id);
      },


      // Qd click sur icone 'search' ds moteur de recherche
      searchProducts() {
        this.displaySearchEngineResults = false; // disparit° autocomplete sans vider son contenu car correspond au texte de recherche que l'utilisateur vient de valider
        const searchString = document.querySelector('.mainInputSearch').value.trim();
        if(searchString !== "") {
          this.$store.dispatch('fetchProductsFromIconSearchEngine', searchString);
        }
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
  font-family: 'Baloo 2', cursive;
  font-size: 15px;
  color: rgb(37, 44, 122);
  border: 0;
  background: none;
  width: calc(100% - 30px);
  box-sizing: border-box;
  padding: 0 3px;
  height: 100%;
  display: inline-block;
}
.mainInputSearch:focus {
  outline: none;
}

#iconBackspace {
  color: rgb(189, 189, 189);
  transition: color 0.2s ease-in-out;
  position: absolute;
  z-index: 1;
  cursor: pointer;
  font-size: 22px;
  margin: 2px 0 0px -38px;
}
#iconBackspace:hover {
  color: rgb(161, 161, 161);
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
  padding: 0;
  box-shadow: 0 0 3px rgba(0,0,0,0.7);
  background-color: #fff;
}

#proposals .lgnProduit {
  display: flex;
  font-size: 14px;
  padding: 3px;
  border-bottom: dotted 1px #254A7B;
  margin: 0 4px;
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
  font-size: 13px;
  border-bottom: solid 1px #254A7B;
  background-color: #2F5C99;
  color: #fff;
  border-radius: 4px 4px 0 0;
  padding: 4px 10px 2px 10px;
  margin: 0;
}
#proposals .lgnProduit i {
    font-style: normal;
    padding: 0 3px;

    background-color: rgb(255, 255, 0);
    /* background-color: pink; */
}

#proposals:after {
	bottom: 100%;
	left: 50%;
	border: solid transparent;
	content: "";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
	border-color: rgba(213, 0, 0, 0);
	border-bottom-color: #2F5C99;
	border-width: 10px;
	margin-left: -10px;
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