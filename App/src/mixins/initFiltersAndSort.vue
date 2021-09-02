<script>
export default {
    methods: {
        initFiltersAndSort() {
            this.$store.commit('SET_FILTERS', {});
            this.$store.commit('SET_FILTERS_QUERY_STRING_PARAMETERS', "");
            this.$store.commit('SET_TRI_QUERY_STRING_PARAMETERS', "");
        }
    }
}
</script>