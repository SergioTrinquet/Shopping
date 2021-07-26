<template>
  <transition name="scale" appear>
    <div class="indicateurNbItems tertiary">
        {{ basketNbItems }}
    </div>
  </transition>
</template>

<script>
  export default {
    computed: {
      basketNbItems() {
        return this.$store.getters.getBasketNbItems;
      }
    },
    watch: {
      basketNbItems() {
        const titi = document.querySelector('.indicateurNbItems');
        titi.classList.add('flash');
        setTimeout(() => { titi.classList.remove('flash') }, 500);
      }
    },
  }
</script>

<style scoped>
.indicateurNbItems {
  position: absolute;
  right: 0;
  top: 0;
  margin: -3px -3px 0 0;
  border-radius: 50%;
  font-weight: bold;
  color: #fff;
  font-size: 13px;
  min-width: 19px;
}

.scale-enter-active, .scale-leave-active {
  transition: transform 0.3s ease-out;
}
.scale-enter, .scale-leave-to {
  transform: scale(0.1);
}

.flash {
  animation: scaling 0.4s ease-in;
}
@keyframes scaling {
  100% { transform: scale(2); opacity: 0.5; }
}
</style>