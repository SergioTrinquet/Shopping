<template>
  <div>
      <span class="tag secondary" v-for="(tag, idx) in listetags" :key="idx">
        <span>{{ tag.libelle }}</span>
        <span class="tagCloseIcon">
            <font-awesome-icon icon="times" 
                class="tertiary-txt_hover" 
                @click="closeTag({ nom: tag.queryStringParam, valeur: tag.queryStringValue })" 
            />
        </span>
      </span>
  </div>
</template>

<script>
export default {
    name: 'FiltersListTags',

    data() {
        return {
            listetags: []
        }
    },

    computed: {
        filters() {
            return this.$store.state.filters;
        },
        filters_query_string_parameters() {
            return this.$store.state.filters_query_string_parameters;
        },
        /* queryStringParameterstoFetchProducts() {
            return this.$store.getters.getQueryStringParametersToFetchProducts;
        } */
    },

    methods: {
        // Retrait du paramètre correspondant au flag ds la query string et appel API pour chargement des produits
        // V1
        /* closeTag(param) {
            console.log("nom param : " + param.nom, "valeur param : " + param.valeur); //TEST
            let searchParams = new URLSearchParams(this.filters_query_string_parameters);

            // Pour déterminer s'il y a plusieurs values avec le même nom de paramètre ou pas
            const lengthParamValues = searchParams.getAll(param.nom).length;
            let newURLstring = "";

            if(lengthParamValues == 1) {
                searchParams.delete(param.nom);
                newURLstring = searchParams.toString();
            } else {
                let newURL = [];
                // Boucle car '.delete()' pas utilisable ici ds le cas ou le paramètre dont il faut supprimer une paire clé/valeur à plusieurs valeurs : '.delete()' supprimerait ttes les paires de ce paramètre
                searchParams.forEach((value, key) => {
                    //console.log("value => ", value, "param.valeur => ", param.valeur, "key => ", key, "param.nom => ", param.nom); //TEST
                    if(!(value == param.valeur && key == param.nom)) {
                        newURL.push(`${key}=${value}`);
                    }
                })
                newURLstring = newURL.join("&");
            }

            // Enregistrement partie de la chaine de requête propre aux filtres
            // NOTE: Fonctionne aussi en passant 'searParams' sans le convertir en string via (.toString()) mais on évite car ds ce cas valeur pas lisible avec 'Vue.js devtools'
            this.$store.commit('SET_FILTERS_QUERY_STRING_PARAMETERS', newURLstring);

            console.log("sélection (GET) => ", this.queryStringParameterstoFetchProducts); //TEST

            // Appel API pour récup. des produits à afficher selon les filtres sélectionnés
            this.$store.dispatch('fetchProductsDepartment', this.queryStringParameterstoFetchProducts);  
        } */

        // V2
        closeTag(param) {
            //console.log("nom param : " + param.nom, "valeur param : " + param.valeur); //TEST
            this.$store.commit('SET_FILTER_TO_REMOVE', param);
        }
    },

    watch: {
        // Pour afficher le bon libellé ds le tag + récupérer paramètres qui seront apel&s qd suppress° d'un tag
        filters_query_string_parameters(val) {
            const searchParams = new URLSearchParams(val);

            this.listetags = [];
            searchParams.forEach((value, key) => {
                console.log("FiltersListags", key, value); //TEST

                if(key == 'nutriscore') {
                    const n = this.filters.nutriscore.filter(n => {
                        if(n.id === value) return n;
                    });
                    this.listetags.push({ 
                        libelle: `nutriscore ${n[0].lettre}`, 
                        queryStringParam: key, 
                        queryStringValue: value 
                    });

                } else if(key == 'label_qualite') {
                    const l = this.filters.label_qual.filter(l => {
                        if(l.id === value) return l;
                    });
                    this.listetags.push({ 
                        libelle: l[0].libelle, 
                        queryStringParam: key, 
                        queryStringValue: value 
                    });

                } else if(key == 'prdsFr') {
                    this.listetags.push({ 
                        libelle: 'produits français', 
                        queryStringParam: key 
                    });

                } else if(key == 'promos') {
                    this.listetags.push({ 
                        libelle: 'promotions', 
                        queryStringParam: key 
                    });

                } else { // Marques
                    this.listetags.push({ 
                        libelle: value, 
                        queryStringParam: key, 
                        queryStringValue: value 
                    });
                }

                /* switch(key) {
                    case 'nutriscore':
                        const n = this.filters.nutriscore.filter(n => {
                            if(n.id === value) return n;
                        })
                        this.listetags.push({ 
                            libelle: `nutriscore ${n[0].lettre}`, 
                            queryStringParam: key, 
                            queryStringValue: value 
                        });
                        break;
                    case 'label_qualite':
                        const l = this.filters.label_qual.filter(l => {
                            if(l.id === value) return l;
                        })
                        this.listetags.push({ 
                            libelle: l[0].label, 
                            queryStringParam: key, 
                            queryStringValue: value 
                        });
                        break;
                    case 'prdsFr':
                        this.listetags.push({ 
                            libelle: 'produits français', 
                            queryStringParam: key 
                        });
                        break;
                    case 'promos':
                        this.listetags.push({ 
                            libelle: 'promotions', 
                            queryStringParam: key 
                        });
                        break;
                    case 'marque':
                        this.listetags.push({ 
                            libelle: value, 
                            queryStringParam: key, 
                            queryStringValue: value 
                        });
                        break;
                } */
            })
        }
    }
}
</script>

<style scoped>
.tag {
    padding: 0 8px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    margin: 0 5px 0 0;
}
.tagCloseIcon {
    margin: 0 0 0 7px;
}
.tagCloseIcon:hover {
    cursor: pointer;
}
</style>