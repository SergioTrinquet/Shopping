<template>
  <app-overlay :display="true">
        <div class="encartConfirmationCommande">
            <font-awesome-icon 
                icon="times" 
                id="iconClose" 
                class="tertiary-txt_hover" 
                @click="emitEventCloseModal"
            />
            <p>Votre commande a été envoyée avec succès!</p> 
            <p>Merci de votre confiance.</p>
        </div>
  </app-overlay>
</template>

<script>
export default {
    name: 'ValidationOrderModal',

    methods: {
        emitEventCloseModal() {
            this.$emit('event-close-modal');
        }
    }
}
</script>

<style>
.encartConfirmationCommande {
    position: fixed;
    z-index: 1;
    background-color: #fff;
    border-radius: 5px;
    padding: 30px 50px;
    box-shadow: 0 4px 10px rgba(0, 0,0, 0.3);
    text-align: center;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
}
.encartConfirmationCommande p {
    margin: 8px;
    font-size: 17px;
    line-height: 22px;
}

#iconClose {
    top: 12px;
    right: 12px;
    font-size: 18px;
}
</style>