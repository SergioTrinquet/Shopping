<template>
    <transition name="autocomplete" appear>
        <div 
            id="proposals" 
            class="proposals primary-txt" 
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
            <div class="marqueProduit" v-html="highlight(result, 'marque')"></div><!-- {{result.score}} -->
        </div>
        </div>
    </transition>
</template>

<script>
import initFiltersAndSort from '@/mixins/initFiltersAndSort'

export default {
    name: 'SearchEngineAutocomplete',

    mixins: [ initFiltersAndSort ],

    computed: {
      autocompleteResults() {
        return this.$store.state.autocomplete_results;
      }
    },

    methods: {
        // Qd click sur un produit ds l'autocomplete
        displayProduct(id) {
            // Redirection vers pg de présentation des produits si besoin   
            if(this.$route.name !== 'Shopping') this.$router.push({ name: 'Shopping', params: { fromSearchEngine: true } });
            // Pour réinitialiser les filtres si l'utilisateur avait choisi au pralable de voir les produits d'un rayon, ainsi que les filtres et le tri qu'il a pu sélectionner
            this.initFiltersAndSort();
            // Recup infos du produit
            this.$store.dispatch('fetchProductFromAutocomplete', id);
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
        }

    }

}
</script>

<style>
.autocomplete-enter,
.autocomplete-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
.autocomplete-enter-active,
.autocomplete-leave-active {
  transition: all 0.25s ease-out;
}


#proposals {
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  margin: 30px 0 0 -8px;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.7);
  background-color: #fff;
}

#proposals .lgnProduit {
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 7px 5px;
  border-bottom: dotted 1px #254A7B;
  margin: 0 4px;
}
#proposals .lgnProduit:last-child {
  border-bottom-width: 0;
}
#proposals .lgnProduit:not(.legende) {
  line-height: 15px;
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
    /* background-color: rgb(255, 255, 0); */
    /* background-color: rgb(47, 92, 153, 0.1); */
    font-weight: bold;
    text-decoration: dotted underline;
}

#proposals .lgnProduit .intituleProduit {
  margin-right: 8px;
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
</style>