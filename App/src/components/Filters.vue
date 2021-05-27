<template>
  <form ref="filtersForm" @change="changeFormValues"><!-- {{ filters }} -->

      <div class="header primary-light">Affiner</div>

      <div class="filterWrapper lgnChbx" v-if="displayFilters.promos">
        <input type="checkbox" id="chbxPromos" name="promos">
        <label for="chbxPromos">Promotions</label>
      </div>

      <div class="filterWrapper lgnChbx"  v-if="displayFilters.produitsFR">
        <input type="checkbox" id="chbxPrdsFrancais" name="prdsFr">
        <label for="chbxPrdsFrancais">Produits français</label>
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
        <!-- <input 
          type="text" 
          id="inputFiltreMarques"
          v-model="champFiltreMarque" 
          @input="filtrageMarques" 
          placeholder="filtrer par marque" 
        /> -->
        <div class="listeMarques" ref="chbx_marques">
          <div class="msgToManyTrades secondary" v-if="displayMsgMarques">Pas plus de {{ nbMaxMarques }} marques, merci !</div>
          <div 
            v-for="(marque, idx) in filters.marques" :key="idx" 
            class="lgnChbx chbx_m" 
            :data-nommarque="marque"
          >
            <input type="checkbox" :id="idx" :value="marque" name="marque"   v-model="vm_marques">
            <label :for="idx">{{ marque }}</label>
          </div>
        </div>
      </div>

      <div class="filterWrapper" v-if="displayFilters.nutriscores">
        <div class="champFiltre">Nutriscore</div>
        <div v-for="score in filters.nutriscore" :key="score._id" class="lgnChbx">
          <input type="checkbox" :id="score._id" :value="score._id" name="nutriscore">
          <label :for="score._id">{{ score.lettre }}</label>
        </div>
      </div>

      <div class="filterWrapper" v-if="displayFilters.labels">
        <div class="champFiltre">Labels qualité</div>
        <div v-for="lq in filters.label_qual" :key="lq._id" class="lgnChbx">
          <input type="checkbox" :id="lq._id" :value="lq._id" name="label_qualite">
          <label :for="lq._id">{{ lq.label }}</label>
        </div>
      </div>
      <!-- {{ selectionFiltres }} -->
  </form> 
</template>

<script>
export default {
  data() {
    return {
      champFiltreMarque: "",
      selectionFiltres: {},
      nbMarquesFiltrage: 0,
      vm_marques: [],
      displayMsgMarques: false
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
    }
    ////
  },

  watch: {
    vm_marques(val) {
      let chbxs = this.$refs.chbx_marques.querySelectorAll('input[type="checkbox"]');
      // Limite sur nb de marques dans filtres : Si plus de X marques cochées, les autres marques sont mises en disabled
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

    // Envoi valeurs des filtres sélectionnés ds le form à chaque modif
    changeFormValues(event) {
      // L'envoi des paramètres pour l'execut° de la requete ne doit pas se faire lorque modif  
      // sur le champ de filtrage des marques, car valeur de ce champ est inutile pour requete
      if(event.target.id !== 'inputFiltreMarques') {
        
        const form = this.$refs.filtersForm;
        const data = new FormData(form);

        let searchParams = new URLSearchParams(data);
        searchParams.append("rayon", this.selected_department.id);
        console.log("sélection (GET) => ", searchParams.toString()); //TEST

        /* TEST */ //this.selectionFiltres = new URLSearchParams(data).toString();

        // Création d'un objet JS listant les sélections de filtres
        let obj = {};
        obj['rayon'] = this.selected_department.id; // Ajout id rayon sélectionné
        for(let [key, value] of data) {
          if(obj[key] !== undefined) {
            if(!Array.isArray(obj[key])) {
              obj[key] = [obj[key]];
            }
            obj[key].push(value);
          } else {
            obj[key] = value;
          }
        }
        this.selectionFiltres = obj;

        console.log("sélection (objet) => ", this.selectionFiltres); //TEST

        this.$store.dispatch('fetchProductsDepartmentWithFilters', this.selectionFiltres);

      } //
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
.lgnChbx label {
  line-height: 16px;
  margin: 4px 0 4px 5px;
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
</style>