<template>
    <div>
        <span class="tag secondary" v-for="(tag, idx) in listeTags" :key="idx">
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
import { mapState } from 'vuex'

export default {
    name: 'FiltersListTags',

    data() {
        return {
            listeTags: []
        }
    },

    computed: {
        ...mapState([
            'filters',
            'filters_query_string_parameters'
        ])
    },

    methods: {
        // Retrait du paramètre correspondant au flag ds la query string et appel API pour chargement des produits
        closeTag(param) {
            this.$store.commit('REMOVE_FILTER_SELECTION', param);
        }
    },

    watch: {
        // Pour afficher le bon libellé ds le tag + récupérer paramètres qui seront apel&s qd suppress° d'un tag
        filters_query_string_parameters: {          
            immediate: true,
            handler(val) {
                const searchParams = new URLSearchParams(val);

                this.listeTags = [];
                searchParams.forEach((value, key) => {
                    console.log("FiltersListags", key, value); //TEST

                    if(key == 'nutriscore') {
                        const n = this.filters.nutriscore.filter(n => {
                            if(n.id === value) return n;
                        });
                        this.listeTags.push({ 
                            libelle: `nutriscore ${n[0].lettre}`, 
                            queryStringParam: key, 
                            queryStringValue: value 
                        });

                    } else if(key == 'label_qualite') {
                        const l = this.filters.label_qual.filter(l => {
                            if(l.id === value) return l;
                        });
                        this.listeTags.push({ 
                            libelle: l[0].libelle, 
                            queryStringParam: key, 
                            queryStringValue: value 
                        });

                    } else if(key == 'prdsFr') {
                        this.listeTags.push({ 
                            libelle: 'produits français', 
                            queryStringParam: key 
                        });

                    } else if(key == 'promos') {
                        this.listeTags.push({ 
                            libelle: 'promotions', 
                            queryStringParam: key 
                        });

                    } else { // Marques
                        this.listeTags.push({ 
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
                            this.listeTags.push({ 
                                libelle: `nutriscore ${n[0].lettre}`, 
                                queryStringParam: key, 
                                queryStringValue: value 
                            });
                            break;
                        case 'label_qualite':
                            const l = this.filters.label_qual.filter(l => {
                                if(l.id === value) return l;
                            })
                            this.listeTags.push({ 
                                libelle: l[0].label, 
                                queryStringParam: key, 
                                queryStringValue: value 
                            });
                            break;
                        case 'prdsFr':
                            this.listeTags.push({ 
                                libelle: 'produits français', 
                                queryStringParam: key 
                            });
                            break;
                        case 'promos':
                            this.listeTags.push({ 
                                libelle: 'promotions', 
                                queryStringParam: key 
                            });
                            break;
                        case 'marque':
                            this.listeTags.push({ 
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
}
</script>

<style scoped>
.tag {
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    padding: 0 8px;
    margin: 0 5px 0 0;
    display: inline-block;
}
.tagCloseIcon {
    margin: 0 0 0 7px;
}
.tagCloseIcon:hover {
    cursor: pointer;
}
</style>