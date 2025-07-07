
// Appelé qd coté front, sélection rayon, ou saisie recherche produit (validat° chp de recherche ou click produit dans autocomplete) : 
// Requetes pour obtenir les filtres correspondants aux produits affichés ainsi que nbr de produit(s) propre à chaque filtre

const requests = require('../requests');

module.exports = (stage) => {
    // Requete pour obtenir les differents scores Nuriscores des produits, et leurs nombres respectifs  
    const result_nutriscore = requests.getNutriscoreFilter(stage)
                                .then(scores => {
                                    return { "nutriscore": scores }
                                }); 


    // Requete pour obtenir les differents labels qualité des produits, et leurs nombres respectifs  
    const result_labelqualite = requests.getLabelsQualiteFilter(stage)
                                    .then(labels => {
                                        return { "label_qual": labels }
                                    });


    // Requete pour obtenir les differentes marques des produits, et leurs nombres respectifs
    const result_marques = requests.getMarquesFilter(stage)
                                .then(marques => {
                                    return { "marques": marques }
                                });


    // Requete pour savoir si Produits Français existent parmi les produits, et leur nombre
    const produitsFR_present = requests.getProduitsFRfilter(stage)
                                .then(prdsFR => {
                                    return {  "ProduitsFRpresence": prdsFR[0] }
                                });


    // Requete pour savoir s'il y a des Promotions pour les produits, et leur nombre
    const promos_present = requests.getPromosFilter(stage)
                            .then(promos => {
                                return {  "PromosPresence": promos[0] }
                            });

     
    // Requetes mongoDB qui sont des promesses exécutées ici en parallèle
    return Promise.all([
        result_nutriscore, 
        result_labelqualite, 
        result_marques,
        produitsFR_present,
        promos_present
    ])
    .then(values => {
        let filters = {};
        for(const result of values) {
            const [key, value] = Object.entries(result)[0];
            filters[key] = value;
        }
        return filters;
    })
    .catch(error => {
        throw error
    })
}