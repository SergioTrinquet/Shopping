import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    data_error: null,
    display_margin_departments: false,
    display_margin_basket: false,
    departments: [],
    products: [],
    basket: {},
    filters: {},
    selected_department: null,
    nb_max_marques: 3,
    liste_type_tri: [
      { id:1, champBdd: "intitule_insensitive", ordre: 1, texte: "intitulé (alphabétique)" },
      { id:2, champBdd: "intitule_insensitive", ordre: -1, texte: "intitulé (alpha. inverse)" },
      { id:3, champBdd: "prix_final", ordre: 1, texte: "Prix (croissant)" },
      { id:4, champBdd: "prix_final", ordre: -1, texte: "Prix (décroissant)" },
      { id:5, champBdd: "prix_unite", ordre: 1, texte: "Prix au kg/l/pièce (croissant)" },
      { id:6, champBdd: "prix_unite", ordre: -1, texte: "Prix au kg/l/pièce (décroissant)" }
    ],
    score_type_tri: { id:0, champBdd: "score", ordre: -1, texte: "pertinence" },
    filters_query_string_parameters: "",
    tri_query_string_parameters: "",
    filter_selection_to_remove: null,
    autocompleteResults: [],

    search_products_type: {} // TEST au 25/06
  },


  mutations: {
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_MESSAGE_ERROR(state, payload) {
      state.data_error = payload;
    },
    SET_DISPLAY_MARGIN_DEPARTMENTS(state, payload) {
      state.display_margin_departments = payload;
    },
    SET_DEPARTMENTS(state, payload) {
      state.departments = payload;
    },
    SET_PRODUCTS(state, payload) {
      state.products = payload;
    },
    SET_DISPLAY_MARGIN_BASKET(state, payload) {
      state.display_margin_basket = payload;
    },
    SET_QUANTITY_TO_BASKET(state, payload) {
      // Remplace un article du panier (chgmt quantité)
      // Supprime un article du panier (qté saisie = 0 alors qu'avant non)
      // Ajout d'un article dans le panier (qté > 0 alors qu'avant non)
      
      // Test si déjà existence de l'article dans le panier
      let present = false;
      if(typeof state.basket[payload.produit._id] != 'undefined') {
        present = true;
      }

      // Si article pas déjà présent dans panier
      if(present == false) {
        let produitAvecQuantite = {...payload.produit, ...{qte: payload.quantite}}
        state.basket[payload.produit._id] = produitAvecQuantite;
      }

      // Si article déjà présent avant dans panier
      if(present == true) {
        if(payload.quantite > 0) {
          state.basket[payload.produit._id].qte = payload.quantite;
        } else {
          delete state.basket[payload.produit._id];
        }
      }

      // Pour que les modifications sur l'objet 'basket' soit observable, 
      // c'est-à-dire pour qu'il y ait réactivité et que qd modif, cela se répercute dans les .vue et pas seulement dans le store du Vuex
      //state.basket = Object.assign({}, state.basket);
      // ou
      state.basket = {...state.basket};
    },
    SET_FILTERS(state, payload) {
      state.filters = payload;
    },
    SET_SELECTED_DEPARTMENT(state, payload) {
      state.selected_department = {id: payload.id, intitule: payload.intitule };
    },
    SET_FILTERS_QUERY_STRING_PARAMETERS(state, payload) {
      state.filters_query_string_parameters = payload;
    },
    SET_TRI_QUERY_STRING_PARAMETERS(state, payload) {
      state.tri_query_string_parameters = payload;
    },
    REMOVE_FILTER_SELECTION(state, payload) { 
      state.filter_selection_to_remove = payload 
    },
    SET_AUTOCOMPLETE_RESULTS(state, payload) {
      state.autocompleteResults = payload;
    },

    
    // TEST au 25/06
    SET_TYPE_OF_SEARCH_PRODUCTS(state, payload) { 
      state.search_products_type = payload; 
    },


    ADD_LISTE_TRI_OPTION(state) {
      state.liste_type_tri.unshift(state.score_type_tri); // Ajout option 'Pertinence' en 1ere place
    },
    REMOVE_LISTE_TRI_OPTION(state) {
      state.liste_type_tri.shift(); // retrait 1ere option (qui doit être l'option 'Pertinence'
    }
  },


  actions: {
    // Pour alimenter marge coulissante listant rayons
    setDepartments({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_MESSAGE_ERROR', null);

      return axios.get('/api/departments')
        .then((res) => {
          commit('SET_DEPARTMENTS', res.data);
        })
        .catch((err) => {
          console.error(err.response);
          commit('SET_MESSAGE_ERROR', err.response);
        })
        .finally(() => commit('SET_LOADING', false));
    },

    // Pour fermer tous les composants étant potentiellement ouverts avant d'ouvrir celui sur lequel l'utilisateur vient de cliquer
    closeComponents({ commit }) {
      commit('SET_DISPLAY_MARGIN_DEPARTMENTS', false);
      commit('SET_DISPLAY_MARGIN_BASKET', false);
    },

    // Récupération des filtres utiles selon le rayon sélectionné 
    setFiltersFromDepartment({ commit }, payload) {
      commit('SET_LOADING', true);
      commit('SET_MESSAGE_ERROR', null);

      return axios.get(`/api/department/filters/${payload}`)
        .then(res => {
          commit('SET_FILTERS', res.data);
        })
        .catch(err => {
          console.error(err.response);
          commit('SET_MESSAGE_ERROR', err.response);
        })
        .finally(() => commit('SET_LOADING', false));
    },


    // Récupération des filtres utiles selon les produits affichés après recherche dans le champ de recherche
    setFiltersFromSearchString({ commit }, payload) {
      commit('SET_LOADING', true);
      commit('SET_MESSAGE_ERROR', null);

      axios.get(`api/searchstring/filters/${payload}`)
        .then(res => { 
          commit('SET_FILTERS', res.data);
        })
        .catch(err => {
          console.error(err.response);
          commit('SET_MESSAGE_ERROR', err.response);
        })
        .finally(() => commit('SET_LOADING', false));
    },

    
    // Qd click sur rayon dans marge coulissante, ou bien filtres ou encore sur select Tri
    fetchProductsDepartment({ commit, getters }) {
      commit('SET_LOADING', true);
      commit('SET_MESSAGE_ERROR', null);

      return axios.get(`/api/department/products?${getters.getQueryStringParametersToFetchProducts}`)
        .then(res => {
          commit('SET_PRODUCTS', res.data);
        })
        .catch(err => {
          console.error(err.response);
          commit('SET_MESSAGE_ERROR', err.response);
        })
        .finally(() => commit('SET_LOADING', false));
    },


    // Qd validation à partir du moteur de recherche produit (clic sur icone Loupe OU press enter sur input)
    fetchProductsValidationSearchEngine({ commit, getters }) {
      commit('SET_LOADING', true);
      commit('SET_MESSAGE_ERROR', null);

      axios.get(`api/searchstring/products?${getters.getQueryStringParametersToFetchProducts}`)
        .then(res => { 
          commit('SET_PRODUCTS', res.data);
        })
        .catch(err => {
          console.error(err.response);
          commit('SET_MESSAGE_ERROR', err.response);
        })
        .finally(() => commit('SET_LOADING', false));
    },


    // Qd saisie ds champ de saisie recherche : Appel pour récupérer produits coorespondants
    fetchProductsForAutocompleteSearchEngine({ commit }, payload) {
        axios.get(`api/autocomplete/products/${payload}`)
          .then(res => {
            commit('SET_AUTOCOMPLETE_RESULTS', res.data);
          })
          .catch((err) => {
            console.error(err.response);
            commit('SET_MESSAGE_ERROR', err.response);
          })
    },


    // Qd clic sur un produit dans l'autocomplete du moteur de recherche
    fetchProductFromAutocompleteSearchEngine({ commit }, payload) {
      commit('SET_LOADING', true);
      commit('SET_MESSAGE_ERROR', null);

      axios.get(`api/product/${payload}`)
        .then(res => {

          // Affectation 'selected_department' pour enregistrer le rayon sélectionné
          commit('SET_SELECTED_DEPARTMENT', 
          { 
            id: res.data[0].rayon._id, 
            intitule: res.data[0].rayon.intitule 
          });

          commit('SET_PRODUCTS', res.data);
        })
        .catch(err => {
          console.error(err.response);
          commit('SET_MESSAGE_ERROR', err.response);
        })
        .finally(() => commit('SET_LOADING', false));
    }
    
  },


  getters: {
    getBasketNbItems(state) {
      let nbItems = 0;
      for(let item of Object.values(state.basket)) {
        nbItems += item.qte
      }
      return nbItems;
    },

    getBasketTotalPrice(state) {
      let totalPrice = 0;
      for(let item of Object.values(state.basket)) {
        totalPrice += (parseFloat(item.prix_final) * item.qte)
      }
      return totalPrice.toFixed(2);
    },

    // Traitement sur 'basket' pour classer items du Panier par ordre alpha sur 'intitule' puis par rayon
    getBasketSortedByDepartment(state) {
      let tempoSortedItems = [];
      for(let item of Object.values(state.basket)) {    
          //console.log('dept', item.rayon.intitule, 'prod', item); //TEST
          tempoSortedItems.push({dept: item.rayon.intitule, prod: item});
      }
      tempoSortedItems.sort((a, b) => (a.prod.intitule > b.prod.intitule) ? 1 : ((a.prod.intitule < b.prod.intitule) ? -1 : 0)); // Pour classer par 'intitule'...
      tempoSortedItems.sort((a, b) => (a.dept > b.dept) ? 1 : ((a.dept < b.dept) ? -1 : 0)); // ...Puis pour classer par rayon

      // Pour regrouper les produits du panier par rayon (1 enregistrement du tableau 'finalSortedItems' = 1 rayon mais potentiellement plusieurs produits)
      let dept = null;
      let finalSortedItems = [];
      let y = -1;
      tempoSortedItems.forEach(b => {
          if(b.dept != dept) {
            finalSortedItems.push({dept: b.dept, prod: [b.prod]});
            y++;
          } else {
            finalSortedItems[y].prod.push(b.prod);
          }
          dept = b.dept;
      })

      return finalSortedItems;
    },

    // Signale si au moins un des composants est ouvert (composant marge des rayons et composant marge panier)
    areComponentsOpen(state) {
      return state.display_margin_departments || state.display_margin_basket;
    },

    // Construction de la partie 'search' de l'URL utilisée pour l'API qui va récupérer les produits 
    // en concaténant les paramètres des filtres + l'id du rayon + les paramètres du tri
    getQueryStringParametersToFetchProducts(state) {    
      let searchParams = new URLSearchParams(state.filters_query_string_parameters);

      // Ajout paramètre id rayon OU texte saisi ds moteur de recherche, selon le type de recherche effectuée par l'utilisateur
      searchParams.append(Object.keys(state.search_products_type)[0], Object.values(state.search_products_type)[0]);
      
      // Ajout ID tri des produits à l'URL si classement sélectionné
      const selectedOrder = !!state.tri_query_string_parameters; 
      if(selectedOrder) { searchParams.append("tri", state.tri_query_string_parameters) }

      console.log("Appel getter 'getQueryStringParametersToFetchProducts'", searchParams.toString()); //TEST

      return searchParams.toString();
    },


    // Aiguillage selon type de recherche entre produits à aller chercher via action 'fetchProductsDepartment' qd recherche par rayon,
    // et produits via action 'fetchProductsValidationSearchEngine' qd recherche via moteur de recherche
    getGoodActionName(state, getters) {   
      let action = null;
      const queryString = new URLSearchParams(getters.getQueryStringParametersToFetchProducts);
      if(queryString.has('rayon')) {
          action = 'fetchProductsDepartment';
      } else if(queryString.has('searchstring')) {
          action = 'fetchProductsValidationSearchEngine';
      }

      return action;
    }

  },

  modules: {
  }
})
