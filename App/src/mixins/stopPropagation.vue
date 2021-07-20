<script>
export default {
    methods: {
        // Pour empecher la méthode 'closeMarge' d'être active qd click sur la marge
        stopPropagation(e) { e.stopPropagation() }
    }
}
</script>