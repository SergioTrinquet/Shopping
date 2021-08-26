<script>
export default {
    methods: {
        clearSearch() {
            const newValue = "";
            document.querySelector('.mainInputSearch').value = newValue;
            this.setDisplayIconClearSearch(newValue);
            this.$store.commit('SET_AUTOCOMPLETE_RESULTS', []); // disparit° autocomplete en vidant son contenu
        },
        
        setDisplayIconClearSearch(inputValue) {
            this.$store.commit('SET_DISPLAY_ICON_SEARCH', inputValue.length > 0);
        }
    }
}
</script>