import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/css/main.css' // Import css global maison

/* Ajout pour font-awesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faSearch, faHeart, faShoppingBasket, faShoppingCart, faChevronRight, faCircleNotch, faExclamationCircle, faTimes, faPlusCircle, faMinusCircle, faBackspace, faTrashAlt, faUser, faFilter } from '@fortawesome/free-solid-svg-icons'
library.add(faBars, faSearch, faHeart, faShoppingBasket, faShoppingCart, faChevronRight, faCircleNotch, faExclamationCircle, faTimes, faPlusCircle, faMinusCircle, faBackspace, faTrashAlt, faUser, faFilter)

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('font-awesome-icon', FontAwesomeIcon)
/* FIN Ajout pour font-awesome */

import OverlayComponent from '@/components/base/AppOverlay'
Vue.component('app-overlay', OverlayComponent)


Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App),
  errorCaptured(err, component, details) {
    this.$store.commit('SET_MESSAGE_ERROR', {data: {titre: err, message: details}} ); // Pour afficher l'encart avec message d'erreur
    console.error("err => ", err, "\ncomponent => ", component.$vnode.elm, "\ndetails => ", details);   //component.$vnode.componentOptions.tag
    return false; // Pour ne pas que l'erreur remonte jusqu'à "Vue.config.errorHandler" si présent
  }
}).$mount('#app')
