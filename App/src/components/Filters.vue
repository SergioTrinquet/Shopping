<template>
  <div>
  <form ref="filtersForm" @change="changeFormValues"><!--  -->
      <div class="header primary-light">Filtres</div>
      <div class="filterWrapper lgnChbx">
        <input type="checkbox" id="chbxPromos" name="chbxPromos">
        <label for="chbxPromos">N'affichez que les promotions</label>
      </div>

      <div class="filterWrapper">
        <div class="champFiltre">
          Marques <span class="nbMarques">
          ({{ nbMarquesFiltrage }})</span>
        </div>
        <input 
          type="text" 
          v-model="champFiltreMarque" 
          @input="filtrageMarques" 
          placeholder="filtrer par marque" 
        />
        <div class="listeMarques" ref="chbx_marques">
          <div 
            v-for="(marque, idx) in filters.marques" :key="idx" 
            class="lgnChbx chbx_m" 
            :data-nommarque="marque"
          >
            <input type="checkbox" :id="idx" :value="marque" name="marque">
            <label :for="idx">{{ marque }}</label>
          </div>
        </div>
      </div>

      <div class="filterWrapper">
        <div class="champFiltre">Nutriscore</div>
        <div v-for="score in filters.nutriscore" :key="score._id" class="lgnChbx">
          <input type="checkbox" :id="score._id" :value="score._id" name="nutriscore">
          <label :for="score._id">{{ score.lettre }}</label>
        </div>
      </div>

      <div class="filterWrapper">
        <div class="champFiltre">Labels qualité</div>
        <div v-for="lq in filters.label_qual" :key="lq._id" class="lgnChbx">
          <input type="checkbox" :id="lq._id" :value="lq._id" name="label">
          <label :for="lq._id">{{ lq.label }}</label>
        </div>
      </div>
  </form><!--  -->  {{ selectionFiltres }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      champFiltreMarque: "",
      selectionFiltres: {},
      nbMarquesFiltrage: 0
    }
  },

  computed: {
    filters() {
      return this.$store.state.filters;
    }
  },

  methods: {
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

    changeFormValues() {
      //console.log("Modif sur form"); //TEST
      const form = this.$refs.filtersForm;
      const data = new FormData(form);

      /* TEST */ //this.selectionFiltres = new URLSearchParams(data).toString();

      let obj = {};
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

      //this.$store.dispatch('sendFiltersSelection', this.selectionFiltres); // A TERMINER
    }
  },

  mounted() {
      // Chargement des filtres
      this.$store.dispatch("setFilters")
        .then(() => this.nbMarquesFiltrage = this.$refs.chbx_marques.querySelectorAll('.chbx_m').length)
  }
}
</script>

<style scoped>
.filterWrapper {
  border-bottom: dashed 1px #9f9f9f;
  padding: 8px 0;
}
#filterWrapper:last-child {
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