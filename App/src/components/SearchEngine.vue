<template>
    <div id="searchEngine">
        <input 
            type="text" 
            class="mainInputSearch" 
            placeholder="Rechercher un produit par son nom ou sa marque"
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

        <Autocomplete v-if="displaySearchEngineResults" />

    </div>
</template>

<script>
const Autocomplete = () => import(/* webpackChunkName: "SearchEngineAutocomplete" */ '@/components/SearchEngineAutocomplete')

import clearSearchEngine from '@/mixins/clearSearchEngine'

export default {
    name: 'SearchEngine',

    components: {
        Autocomplete
    },

    mixins: [ clearSearchEngine ],

    data() {
        return {
          old_saisie: "",
          timer: null,
          displaySearchEngineResults: false
        }
    },

    computed: {
      autocompleteResults() {
        return this.$store.state.autocomplete_results;
      },
      // Pour servir de flag pour ajouter/retirer l'option 'pertinence' ds le select du tri
      searchBySearchString() {  
        return typeof this.$store.state.search_products_type.searchstring !== "undefined";
      },
      displayIconClearSearch() {
        return this.$store.state.display_icon_clear_search;
      }
    },

    watch: {
      autocompleteResults(val) {
        this.displaySearchEngineResults = val.length > 0;
      },

      // Qd recherche par moteur de rech., ajout/retrait ds liste déroulante 'Tri' d'une option 'pertinence'
      searchBySearchString(val) { 
        //console.warn("WATCH searchBySearchString", val); //TEST
        this.$store.commit(val ? 'ADD_LISTE_TRI_OPTION' : 'REMOVE_LISTE_TRI_OPTION');
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
            this.timer = setTimeout(() => this.$store.dispatch('fetchProductsForAutocomplete', new_saisie), 200); // Déclenchement action après 200ms
          }
        }
        
        this.old_saisie = new_saisie;
      },


      // Qd validation ds moteur de recherche produit (clic sur icone Loupe OU press enter sur input)
      searchProducts() {
        // Redirection vers pg de présentation des produits si besoin            
        if(this.$route.name !== 'Shopping') this.$router.push({ name: 'Shopping' });

        this.displaySearchEngineResults = false; // disparit° autocomplete sans vider son contenu car correspond au texte de recherche que l'utilisateur vient de valider
        const searchString = document.querySelector('.mainInputSearch').value.trim();
        if(searchString !== "") {
          // Affectation 'selected_department' pour signifier que pas de rayon sélectionné et donc faire disparaitre div qui affiche nom du rayon
          this.$store.commit('SET_SELECTED_DEPARTMENT', {});
        
          // Commit du paramètre pour construction de la queryString qui sera passée coté backend vai l'action 'fetchProducts' qui suit
          // On indique par la même occasion quel moyen on recherche des produits (par rayon, ou par recherche ds le moteur)
          this.$store.commit('SET_TYPE_OF_SEARCH_PRODUCTS', { 'searchstring': searchString });

          // Appel API pour récup. des produits
          this.$store.dispatch('fetchProducts');

          // Récupération des filtres à partir de la recherche
          this.$store.dispatch('setFilters');
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
              e.target.id == "searchEngine" || 
              Array.from(document.querySelector("#searchEngine").children).includes(e.target) 
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
  max-width: 800px;
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

#app[data-narrow-screen] #searchEngine {
  width: 85%;
}
#app[data-narrow-screen] #iconBackspace {
  margin: 2px 0 0px -30px;
}
#app[data-narrow-screen] #iconSearch {
  margin: 0px 0 0px 7px;
}
</style>