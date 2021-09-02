import Vue from 'vue'
import Vuex from 'vuex'

import APIcall from '/helpers/APIcall'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: 0,
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
    autocomplete_results: [],
    search_products_type: {},
    display_icon_clear_search: false,
    validation_order_cmd: false
  },


  mutations: {
    // Qd state 'loading' est un booleen, si plusieurs appels async. parallèles, le 1er qui se terminait faisiat disparaitre le loader : 
    // Ici plus le cas car 'loaderInt' doit être = 0 pour disparaitre  
    ADD_LOADING(state) { 
      state.loading += 1;
    },
    REMOVE_LOADING(state) { 
      state.loading -= 1;
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
    REMOVE_BASKET(state) {
      state.basket = {};
    },
    SET_FILTERS(state, payload) {
      state.filters = payload;
    },
    SET_SELECTED_DEPARTMENT(state, payload) {
      state.selected_department = payload !== null ? {id: payload.id, intitule: payload.intitule } : null;
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
      state.autocomplete_results = payload;
    },
    ADD_LISTE_TRI_OPTION(state) {
      state.liste_type_tri.unshift(state.score_type_tri); // Ajout option 'Pertinence' en 1ere place
    },
    REMOVE_LISTE_TRI_OPTION(state) {
      state.liste_type_tri.shift(); // retrait 1ere option (qui doit être l'option 'Pertinence'
    },
    SET_TYPE_OF_SEARCH_PRODUCTS(state, payload) { 
      state.search_products_type = payload; 
    },
    SET_DISPLAY_ICON_SEARCH(state, payload) {
      state.display_icon_clear_search = payload;
    },
    SET_VALIDATION_ORDER_CMD(state, payload) {
      state.validation_order_cmd = payload;
    }
  },


  actions: {
    // Pour alimenter marge coulissante listant rayons
    async setDepartments(context) {
      const path = '/api/departments';
      const data = await APIcall(context, path);
      if(data) context.commit('SET_DEPARTMENTS', data);
    },


    // Récupération des filtres utiles
    async setFilters(context) {
      const pathSegment = context.getters.getAPISegmentPath;
      const searchArg = Object.values(context.state.search_products_type)[0];
      const path = `/api/${pathSegment}/filters/${searchArg}`;

      const data = await APIcall(context, path);
      if(data) context.commit('SET_FILTERS', data);
    },
    

    // Qd click sur rayon dans marge coulissante, ou bien filtres ou encore sur select Tri,
    // ou bien encore qd validation à partir du moteur de recherche produit (clic sur icone Loupe OU press enter sur input)
    async fetchProducts(context) {
      const queryStringParameters = context.getters.getQueryStringParametersToFetchProducts;
      const pathSegment = context.getters.getAPISegmentPath;
      const path = `api/${pathSegment}/products?${queryStringParameters}`;

      const data = await APIcall(context, path);  
      if(data) context.commit('SET_PRODUCTS', data);
    },


    // Qd saisie ds champ de saisie recherche : Appel pour récupérer produits correspondants
    async fetchProductsForAutocomplete(context, payload) {
      const path = `api/autocomplete/products/${payload}`;
      const data = await APIcall(context, path, false);  
      if(data) context.commit('SET_AUTOCOMPLETE_RESULTS', data);
    },


    // Qd clic sur un produit dans l'autocomplete du moteur de recherche
    async fetchProductFromAutocomplete(context, payload) {
      const path = `api/product/${payload}`;
      let data = await APIcall(context, path);
      if(data) {  
        // Affectation 'selected_department' pour enregistrer le rayon sélectionné
        context.commit('SET_SELECTED_DEPARTMENT', 
        { 
          id: data[0].rayon._id, 
          intitule: data[0].rayon.intitule 
        });

        context.commit('SET_PRODUCTS', data);
      }
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

        // Calcul Promo du type "1€ offert pour X achetés"...
        if(typeof item.promotion !== 'undefined' && typeof item.promotion.reduction !== 'undefined') {
          if(item.qte >= item.promotion.reduction.qte) {
            totalPrice -= item.promotion.reduction.somme
          }
        }
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


    getAPISegmentPath(state, getters) {
      const queryStringParameters = getters.getQueryStringParametersToFetchProducts;
      const parameters = new URLSearchParams(queryStringParameters);
      let pathSegment = '';
      if(parameters.has('rayon')) {
        pathSegment = 'department';
      } else if(parameters.has('searchstring')) {
        pathSegment = 'searchstring';
      }
      return pathSegment;
    }

  }

})
