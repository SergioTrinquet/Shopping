<template>
    <div>
        Trier par :
        <select @change="sendOrderChoice" v-model="selectOrderProducts" id="selectTri">
            <option 
                v-for="typeTri in listeTypeTri" :key="typeTri.id" 
                :value="{ id: typeTri.id, champBdd: typeTri.champBdd, ordre: typeTri.ordre }"
            >
            {{ typeTri.texte }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    name: 'ProductsSelectOrder',

    data() {
        return {
            selectOrderProducts: { id: 1, champBdd: "intitule", ordre: 1 }
        }
    },

    computed: {
        listeTypeTri() {
            return this.$store.state.liste_type_tri;
        }
    },

    watch: {
        // "immediate: true" pour que ce watch soit executé lors de l'affectation initiale du computed correspondant (a la creation du composant), sinon pas executé.
        listeTypeTri: {
            immediate: true,
            handler() {
                this.$nextTick(() => {
                    const selectTri = document.querySelector("#selectTri");

                    selectTri.selectedIndex = 0; // Qd modif sur nbr d'option dans le select Tri : Sélect° sur 1ere option...

                    // ...puis on déclenche l'evenement 'change' sur le select du Tri pour appliquer le Tri en quest° sur les produits
                    const e = new Event("change");
                    selectTri.dispatchEvent(e);
                });
            }
        }
    },

    methods: {
        sendOrderChoice() {     
            const searchParams = new URLSearchParams(this.selectOrderProducts);

            // Enregistrement ds le store de la value du classement sélectionné sous forme de chaine de requête. Va mettre à jour la chaine de requete globale (filtres + tri + type de recherche) construite ds getter 'getQueryStringParameterstoFetchProducts'
            // NOTE: Fonctionne aussi en passant 'searchParams' sans le convertir en string via (.toString()) mais on évite car ds ce cas valeur pas lisible avec 'Vue.js devtools'
            this.$store.commit('SET_TRI_QUERY_STRING_PARAMETERS', searchParams.toString());

            // Appel API pour récup. des produits à afficher ds l'ordre du tri sélectionné : 
            this.$store.dispatch('fetchProducts');
        }
    }
}
</script>

<style scoped>
select {
    background-color: #F0F0F0;
    border-width: 0;
    padding: 4px;
    font-size: 12px;
    font-family: 'Baloo 2', cursive;
    cursor: pointer;
}
</style>