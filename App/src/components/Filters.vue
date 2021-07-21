<template>
  <form ref="filtersForm" @change="changeFormValues">

      <div class="header primary-light">
        <span>Affiner</span> 
        <span 
          class="linkRemoveFiltersSelection tertiary_hover"
          :class="displayButton ? '' : 'hidden'"
          @click="confirmRemoveFilters"
        >
          Effacer les filtres
        </span>  
      </div>

      <div class="filterWrapper lgnChbx tertiary-txt_hover" v-if="displayFilters.promos">
        <input type="checkbox" id="chbxPromos" name="promos"  v-model="promos">
        <label for="chbxPromos">Promotions</label>
        <span class="nb secondary">{{ filters.PromosPresence.total }}</span>
      </div>

      <div class="filterWrapper lgnChbx tertiary-txt_hover"  v-if="displayFilters.produitsFR">
        <input type="checkbox" id="chbxPrdsFrancais" name="prdsFr"  v-model="prdsFr">
        <label for="chbxPrdsFrancais">Produits français</label>
        <span class="nb secondary">{{ filters.ProduitsFRpresence.total }}</span>
      </div>

      <div class="filterWrapper" v-if="displayFilters.marques">
        <div class="champFiltre">
          Marques <span class="nbMarques">
          ({{ nbMarquesFiltrage }})</span>
        </div>
        <input 
          type="text" 
          id="inputFiltreMarques"
          v-model="champFiltreMarque" 
          @input="filtrageMarques" 
          placeholder="filtrer par marque" 
          v-if="filters.marques.length > 5"
        />
        <div class="listeMarques" ref="chbx_marques">
          <div class="msgToManyTrades secondary" v-if="displayMsgMarques">Pas plus de {{ nbMaxMarques }} marques, merci !</div>
          <div 
            v-for="(mq, idx) in filters.marques" :key="idx" 
            class="lgnChbx chbx_m  tertiary-txt_hover" 
            :data-nommarque="mq"
          >
            <input type="checkbox" :id="idx" :value="mq.libelle" name="marque"   v-model="marque">
            <label :for="idx">{{ mq.libelle }}</label>
            <span class="nb secondary">{{ mq.total }}</span>
          </div>
        </div>
      </div>

      <div class="filterWrapper" v-if="displayFilters.nutriscores">
        <div class="champFiltre">Nutriscore</div>
        <div v-for="score in filters.nutriscore" :key="score.id" class="lgnChbx tertiary-txt_hover">
          <input type="checkbox" :id="score.id" :value="score.id" name="nutriscore"  v-model="nutriscore">
          <label :for="score.id">{{ score.lettre }}</label>
          <span class="nb secondary">{{ score.total }}</span>
        </div>
      </div>

      <div class="filterWrapper" v-if="displayFilters.labels">
        <div class="champFiltre">Labels qualité</div>
        <div v-for="lq in filters.label_qual" :key="lq.id" class="lgnChbx tertiary-txt_hover">
          <input type="checkbox" :id="lq.id" :value="lq.id" name="label_qualite"  v-model="label_qualite">
          <label :for="lq.id">{{ lq.libelle }}</label>
          <span class="nb secondary">{{ lq.total }}</span>
        </div>
      </div>
  </form> 
</template>

<script>
export default {
  data() {
    return {
      champFiltreMarque: "",
      nbMarquesFiltrage: 0,
      displayMsgMarques: false,
      promos: false,
      prdsFr: false,
      marque: [],
      nutriscore: [],
      label_qualite: [],
      filters_type: [
      { typeChbx: "single", name: "promos" },
      { typeChbx: "single", name: "prdsFr" },
      { typeChbx: "multiple", name: "marque" },
      { typeChbx: "multiple", name: "label_qualite" },
      { typeChbx: "multiple", name: "nutriscore" },
    ], 
    }
  },


  computed: {
    filters() {
      return this.$store.state.filters;
    },
    selected_department() {
      return this.$store.state.selected_department;
    },
    nbMaxMarques() {
      return this.$store.state.nb_max_marques;
    },
    displayFilters() {
      let f = {};
      f.promos = this.filters.PromosPresence;
      f.produitsFR = this.filters.ProduitsFRpresence;
      f.marques = (this.filters.marques.length > 0 ? true : false);
      f.nutriscores = (this.filters.nutriscore.length > 0 ? true : false);
      f.labels = (this.filters.label_qual.length > 0 ? true : false);
      return f;
    },

    ////
    filterMarquesCount() {
      return this.$store.state.filters.marques.length;
    },
    ////

    filter_selection_to_remove() { 
      return this.$store.state.filter_selection_to_remove; 
    },
    displayButton() {
        const filtersQueryStringParams = this.$store.state.filters_query_string_parameters;
        return Array.from(new URLSearchParams(filtersQueryStringParams).keys()).length > 2;
    }
  },


  watch: {
    // Limitat° sur nb de marques à cocher
    marque(val) {
      let chbxs = this.$refs.chbx_marques.querySelectorAll('input[type="checkbox"]');
      // Si plus de X marques cochées, les autres marques sont mises en disabled
      if(val.length == this.nbMaxMarques) { 
        this.displayMsgMarques = true;
        chbxs.forEach(c => {
          if(!val.includes(c.value)) {
            c.disabled = true; 
          }
        });
      } else {
        this.displayMsgMarques = false;
        chbxs.forEach(c => c.disabled = false );
      }
    },


    // A chaque fois que des nouveaux filtres sont chargés (suite à validat° chp de recherche/click prd sur autocomplete/chgmt de rayon), 
    // on réinitialise la sélection des filtres
    filters() {
      this.removeSelectionFormFilters();
    },


    // Pour afficher nb de marques qd chgmt de rayon
    filterMarquesCount(val) {
      this.nbMarquesFiltrage = val;
    },
    
    // Réinitialisation 'champFiltreMarque' à chaque chgt de rayon
    selected_department() {
      console.log("Changement de rayon"); //TEST
      this.champFiltreMarque = "";
    },

    // Suppression filtre qd click sur tag du composant 'FiltersListTags'
    filter_selection_to_remove(val) { 
      // Ci-dessous référence aux v-models avec une écriture un peu différente (par ex: 'this["promos"]' est la m chose que 'this.promos')
      this.filters_type.forEach(f => { 
        if(f.name == val.nom && f.typeChbx == 'single') {
            this[val.nom] = "";
        }
        if(f.name == val.nom && f.typeChbx == 'multiple') {
          this[val.nom] = this[val.nom].filter(m => m !== val.valeur);
        }
      })
      
      // Déclenchement manuel de l'evenement on change pour executer methode 'changeFormValues'
      this.triggerEventFormFilters();
    }

  },

  methods: {
    // Input texte pour filtrer sur les marques
    filtrageMarques() {
      const chbx = this.$refs.chbx_marques.querySelectorAll('.chbx_m'); // Selection de ttes les balises comprenant les checkbox et leur libellé
      let r = new RegExp(this.champFiltreMarque, "i"); // Regex à partir de ce qui est saisi ds champ filtre
      chbx.forEach(c => {
        const nomMarque = c.getAttribute('data-nommarque');
        c.classList.toggle("hidden", !(r.test(nomMarque)));
      });
      // Nb de marques correspondant à saisie ds chp de filtrage
      this.nbMarquesFiltrage = this.$refs.chbx_marques.querySelectorAll('.chbx_m:not(.hidden)').length;
    },


    // A chaque modif de sélection des filtres dans le form, fonction ci-dessous appelée pour construire 
    // chaine de requete de l'url destinée à récupérer les bon produits
    changeFormValues(event) {
      // L'envoi des paramètres pour l'execut° de la requete ne doit pas se faire lorque modif  
      // sur le champ de filtrage des marques, car valeur de ce champ est inutile pour requete
      if(event.target.id !== 'inputFiltreMarques') {
        const form = this.$refs.filtersForm;
        const data = new FormData(form);
        const searchParams = new URLSearchParams(data);

        // Enregistrement partie de la chaine de requête propre aux filtres. Va mettre à jour la chaine de requete globale (filtres + tri + type de recherche) construite ds getter 'getQueryStringParameterstoFetchProducts'
        // NOTE: Fonctionne aussi en passant 'searchParams' sans le convertir en string via (.toString()) mais on évite car ds ce cas valeur pas lisible avec 'Vue.js devtools'
        this.$store.commit('SET_FILTERS_QUERY_STRING_PARAMETERS', searchParams.toString());
        
        // Appel API pour récup. des produits à afficher selon les filtres sélectionnés : 
        this.$store.dispatch('fetchProducts');
      }
    },

    confirmRemoveFilters() {
      let c = confirm("Etes-vous sûr de vouloir supprimer tous les filtres ?");
      if(c) {
        this.removeSelectionFormFilters();
      }
    },

    removeSelectionFormFilters() {
      this.filters_type.forEach(f => {
        if(f.typeChbx == 'single' && this[f.name]) {
          this[f.name] = false;
        }
        if(f.typeChbx == 'multiple' && this[f.name].length > 0) {
          this[f.name] = [];
        }
      });
      // Déclenchement manuel de l'evenement on change pour executer methode 'changeFormValues'
      this.triggerEventFormFilters();
    },

    triggerEventFormFilters() {
      // Déclenchement manuel de l'evenement on change pour executer methode 'changeFormValues'
      this.$nextTick(() => {
        const e = new Event("change");
        this.$refs.filtersForm.dispatchEvent(e);
      })
    }

  },

  mounted() {
    this.nbMarquesFiltrage = this.filterMarquesCount;
  }
}
</script>

<style scoped>
.msgToManyTrades {
  width: 200px;
  font-size: 12px;
  color: #fff;
  border-radius: 3px;
  line-height: 14px;
  padding: 4px;
  box-sizing: border-box;
  margin: 3px 0;
}
.filterWrapper {
  border-bottom: dashed 1px #9f9f9f;
  padding: 8px 0;
}
.filterWrapper:last-child {
  border-bottom-width: 0;
}

.header {
  font-weight: bold;
  margin: 0 0 5px 0;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.champFiltre {
  font-weight: bold;
}

.lgnChbx {
  display: flex;
}
.lgnChbx.tertiary-txt_hover,
.lgnChbx.tertiary-txt_hover .nb {
  transition: all 0.2s ease-in-out;
}
.lgnChbx.tertiary-txt_hover:hover .nb {
  background-color: #fb4b4b;
}
.lgnChbx label {
  line-height: 16px;
  margin: 4px 0 4px 5px;
  flex-grow: 1;
}

.nbMarques {
  font-weight: normal;
}
.listeMarques {
  overflow-y: auto;
  max-height: 150px;
}

input[type="checkbox"],
label {
  cursor: pointer;
}

.hidden {
  display: none;
}

.nb {
  font-size: 12px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  padding: 0 3px;
  border-radius: 40%;
  min-width: 13px;
  margin: 0 0 0 5px;
  height: 18px;
  align-self: center;
}


.linkRemoveFiltersSelection {
  font-size: 12px; 
  font-weight: bold; 
  text-align: right;
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  /* V2 */
  text-decoration: none;
  border: solid 2px;
  padding: 0 5px;
  border-radius: 15px;
  line-height: 17px;
  color: #2c3e50c2;

  /* V3 */
  line-height: 19px;
  padding: 0 8px;
  color: #fff;
  background-color: #295187ed;
  border: 0;
}
</style>