<template>
    <div>
        Trier par :
        <select @change="sendOrderChoice" v-model="selectOrderProducts">
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
            selectOrderProducts: { id:1, champBdd: "intitule", ordre: 1 }
        }
    },

    computed: {
        listeTypeTri() {
            return this.$store.state.listeTypeTri;
        },
        queryStringParameterstoFetchProducts() {
            return this.$store.getters.getQueryStringParametersToFetchProducts;
        }
    },

    methods: {
        sendOrderChoice() {
            const searchParams = new URLSearchParams(this.selectOrderProducts);

            // Enregistrement value du classement sélectionné dans le store
            // NOTE: Fonctionne aussi en passant 'searParams' sans le convertir en string via (.toString()) mais on évite car ds ce cas valeur pas lisible avec 'Vue.js devtools'
            this.$store.commit('SET_TRI_QUERY_STRING_PARAMETERS', searchParams.toString());
            
            //console.log("sélection (GET) => ", this.queryStringParameterstoFetchProducts); //TEST
            
            // Appel API pour récup. des produits à afficher dans le bon ordre
            this.$store.dispatch('fetchProductsDepartment', this.queryStringParameterstoFetchProducts);
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
}
</style>