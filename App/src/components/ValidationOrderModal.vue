<template>
  <app-overlay>
        <div class="encartConfirmationCommande">
            <font-awesome-icon 
                icon="times" 
                id="close" 
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
    box-shadow: 0 0 0 100vh rgba(0, 0,0, 0.5);
    text-align: center;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
}
.encartConfirmationCommande p {
    margin: 2px;
    font-size: 17px;
}

#close {
    position: absolute;
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
    top: 12px;
    right: 12px;
    font-size: 18px;
}
#close:hover {
    transform: rotate(180deg);
}
</style>