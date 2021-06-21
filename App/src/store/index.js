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
    nbMaxMarques: 3,
    listeTypeTri: [
      { id:1, champBdd: "intitule", ordre: 1, texte: "intitulé (alphabétique)", selected: true },
      { id:2, champBdd: "intitule", ordre: -1, texte: "intitulé (alpha. inverse)", selected: false },
      { id:3, champBdd: "prix", ordre: 1, texte: "Prix (croissant)", selected: false },
      { id:4, champBdd: "prix", ordre: -1, texte: "Prix (décroissant)", selected: false },
      { id:5, champBdd: "prix_unite", ordre: 1, texte: "Prix au kg/l/pièce (croissant)", selected: false },
      { id:6, champBdd: "prix_unite", ordre: -1, texte: "Prix au kg/l/pièce (décroissant)", selected: false }
    ],
    filters_query_string_parameters: "",
    tri_query_string_parameters: "",
    filter_to_remove: null,
    autocompleteResults: []
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
    SET_FILTER_TO_REMOVE(state, payload) { 
      state.filter_to_remove = payload 
    },
    SET_AUTOCOMPLETE_RESULTS(state, payload) {
      state.autocompleteResults = payload;
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

    // Pour fermer tous les composants étant potentiellement ouverts avent d'ouvrir celui sur lequel l'utilisateur vient de cliquer
    closeComponents({ commit }) {
      commit('SET_DISPLAY_MARGIN_DEPARTMENTS', false);
      commit('SET_DISPLAY_MARGIN_BASKET', false);
    },

    // Récupération des filtres utiles selon le rayon sélectionné 
    setFilters({ commit }, payload) {
      commit('SET_LOADING', true);
      commit('SET_MESSAGE_ERROR', null);

      return axios.get(`/api/filters/${payload}`)
        .then(res => {
          commit('SET_FILTERS', res.data);
        })
        .catch(err => {
          console.error(err.response);
          commit('SET_MESSAGE_ERROR', err.response);
        })
        .finally(() => commit('SET_LOADING', false));
    },


    // Qd click sur rayon dans marge coulissante, ou bien filtres ouencore sur select Tri
    fetchProductsDepartment({ commit }, payload) {
      commit('SET_LOADING', true);
      commit('SET_MESSAGE_ERROR', null);

      return axios.get(`/api/department_products?${payload}`)
        .then((res) => {

          // Ajout champ 'prix_reduc' qd il y a une promotion avec pourcentage
          let items = [];
          res.data.forEach(p => {
            if("promotion" in p && p.promotion !== null && p.promotion.pourcent) {
              p.prix_reduc = p.prix - (p.prix/100 * p.promotion.info);
              //console.warn(p.intitule, p.prix_reduc, p); //TEST
            }
            items.push(p);
          })
          
          commit('SET_PRODUCTS', items);
        })
        .catch((err) => {
          console.error(err.response);
          commit('SET_MESSAGE_ERROR', err.response);
        })
        .finally(() => commit('SET_LOADING', false));
    },


    // Qd saisie ds champ de saisie recherche : Appel pour récupérer produits coorespondants
    fetchProductsForAutocompleteSearchEngine({ commit }, payload) {
        axios.get(`api/products/${payload}`)
          .then(res => {
            commit('SET_AUTOCOMPLETE_RESULTS', res.data);
          })
          .catch((err) => {
            console.error(err.response);
            commit('SET_MESSAGE_ERROR', err.response);
          })
    },


    fetchProductFromAutocompleteSearchEngine({ commit }, payload) {   console.log(payload); //TEST
      commit('SET_LOADING', true);
      commit('SET_MESSAGE_ERROR', null);

      axios.get(`api/product/${payload}`)
        .then(res => {
          console.log(res.data); //TEST
          
          // Ajout champ 'prix_reduc' qd il y a une promotion avec pourcentage
          let items = [];
          res.data.forEach(p => {
            if("promotion" in p && p.promotion !== null && p.promotion.pourcent) {
              p.prix_reduc = p.prix - (p.prix/100 * p.promotion.info);
              //console.warn(p.intitule, p.prix_reduc, p); //TEST
            }
            items.push(p);
          })
          
          commit('SET_PRODUCTS', items);
        })
        .catch((err) => {
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
        let prix = "prix_reduc" in item ? item.prix_reduc : item.prix;
        totalPrice += (parseFloat(prix) * item.qte)
      }
      return totalPrice.toFixed(2);
    },

    // Traitement sur 'basket' pour classer items du Panier par ordre alpha sur 'intitule' puis par rayon
    getBasketSortedByDepartment(state) {
      let tempoSortedItems = [];
      for(let item of Object.values(state.basket)) {
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
      searchParams.append("rayon", state.selected_department.id);
      // Ajout ID tri des produits à l'URL si classement sélectionné
      const selectedOrder = !!state.tri_query_string_parameters; 
      if(selectedOrder) { searchParams.append("tri", state.tri_query_string_parameters) }

      return searchParams.toString();
    }

  },

  modules: {
  }
})
