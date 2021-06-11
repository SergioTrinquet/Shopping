<template>
  <form ref="filtersForm" @change="changeFormValues"><!-- {{ filters }} -->

      <div class="header primary-light">Affiner</div>

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
      { typeChbx: "single", name: "promos"/* , libelle: "Promotions" */ },
      { typeChbx: "single", name: "prdsFr"/* , libelle: "Produits français" */ },
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
      return this.$store.state.nbMaxMarques;
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



    queryStringParameterstoFetchProducts() {
        return this.$store.getters.getQueryStringParametersToFetchProducts;
    },


    filter_to_remove() { 
      return this.$store.state.filter_to_remove; 
    },
    /* filters_type() { return this.$store.state.filters_type } */


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

    // Pour afficher nb de marques qd chgmt de rayon
    filterMarquesCount(val) {
      console.log("Changement nb de marques suite à chgmt rayon", "chbxs.length", val); //TEST
      this.nbMarquesFiltrage = val;
    },
    
    // Réinitialisation 'champFiltreMarque' à chaque chgt de rayon
    selected_department() {
      console.log("Changement de rayon"); //TEST
      this.champFiltreMarque = "";
    },

    // Suppression filtre qd click sur tag du composant 'FiltersListTags'
    filter_to_remove(val) { 
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
      this.$nextTick(()=>{
        const e = new Event("change");
        this.$refs.filtersForm.dispatchEvent(e);
      })
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

        // Enregistrement partie de la chaine de requête propre aux filtres
        // NOTE: Fonctionne aussi en passant 'searParams' sans le convertir en string via (.toString()) mais on évite car ds ce cas valeur pas lisible avec 'Vue.js devtools'
        this.$store.commit('SET_FILTERS_QUERY_STRING_PARAMETERS', searchParams.toString());


        // CODE INUTILE ACTUELLEMENT : POUR TRANSFORMER FormData EN OBJET
        // Création d'un objet JS listant les sélections de filtres
        /* let obj = {};
        for(let [key, value] of data) {
          if(obj[key] !== undefined) {
            if(!Array.isArray(obj[key])) {
              obj[key] = [obj[key]];
            }
            obj[key].push(value);
          } else {
            obj[key] = value;
          }
        } */
        ///////////////////////

        console.log("sélection (GET) => ", this.queryStringParameterstoFetchProducts); //TEST

        // Appel API pour récup. des produits à afficher selon les filtres sélectionnés
        this.$store.dispatch('fetchProductsDepartment', this.queryStringParameterstoFetchProducts);       
      }
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
</style>