import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/css/main.css' // Import css global maison

/* Ajout pour font-awesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faSearch, faHeart, faShoppingBasket, faShoppingCart, faChevronRight, faCircleNotch, faExclamationCircle, faTimes, faPlusCircle, faMinusCircle, faBackspace } from '@fortawesome/free-solid-svg-icons'
library.add(faBars, faSearch, faHeart, faShoppingBasket, faShoppingCart, faChevronRight, faCircleNotch, faExclamationCircle, faTimes, faPlusCircle, faMinusCircle, faBackspace)

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('font-awesome-icon', FontAwesomeIcon)
/* FIN Ajout pour font-awesome */

import OverlayComponent from '@/components/base/AppOverlay'
Vue.component('app-overlay', OverlayComponent)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
