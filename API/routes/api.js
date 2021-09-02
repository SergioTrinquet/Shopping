const express = require('express');
const router = express.Router();

const requests = require('../requests');

// Helpers
const getFilters = require('../helpers/getFilters');
const buildMongodbStages = require('../helpers/buildMongodbStages');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


// Pour alimenter marge 'rayons'
router.get("/departments", (req, res, next) => {
    requests.getDepartments
        .then(result => {
            res.json(result);
        })
        .catch(error => { 
            error.customMsg = "Erreur lors de l'étape du chargement de la liste des rayons";
            next(error);
        });
});


// Pour récupérer les produits d'un rayon
router.get("/department/products", async (req, res, next) => {
    try {

        let sortStageDefaultArgument = { intitule: 1 };
        const mongodbStageArguments = buildMongodbStages(req.query, sortStageDefaultArgument);

        const stages = { 
            "sort": mongodbStageArguments.sortStage,
            "match": mongodbStageArguments.matchStage
        } 

        // On passe en argument l'objet 'stages' utiles pour la construction de la requete
        const result = await requests.getProducts(stages);
        res.json(result);

    } catch (error) {
        error.customMsg = "Erreur lors de l'étape de récupération des produits d'un rayon";
        next(error);
    }
});


// Pour récupérer les filtres utiles selon rayon sélectionné (marge gauche qd produits affichés)
router.get("/department/filters/:id_dpt", async (req, res, next) => {
    try {
        const id_department = req.params.id_dpt;
        const stage = { 
            $match: { rayon: new ObjectId(id_department) } 
        };

        const filters = await getFilters(stage);
        res.json(filters);
    } catch (error) {
        error.customMsg = "Etape de récupération des filtres par rayon";
        next(error);
    }
});



// Qd validation sur moteur de recherche : Clic sur icone de recherche (loupe) du moteur de recherche ou touche 'entrée' pour validation saisie
router.get("/searchstring/products", async (req, res, next) => {    
    try {
        const searchText = req.query.searchstring;
        delete req.query.searchstring; // Suppression param 'searchstring' de req.query pour 

        let sortStageDefaultArgument = { score: -1 };
        const mongodbStageArguments = buildMongodbStages(req.query, sortStageDefaultArgument);

        let stages = {
            'search': { 
                'index': 'products', 
                'text': {
                    'query': searchText, 
                    'path': [
                        'intitule', 
                        'marque'
                    ]
                } 
            },
            'addFields': {
                'score': {
                    '$meta': 'searchScore'
                } 
            },
            'sort': mongodbStageArguments.sortStage
        }; 

        if(mongodbStageArguments.matchStage !== {}) {
            stages.match = mongodbStageArguments.matchStage;
        } 

        // On passe en argument l'objet 'stages' utiles pour la construction de la requete
        const result = await requests.getProducts(stages)
        res.json(result);

    } catch (error) {
        error.customMsg = "Erreur lors de l'étape de récupération des produits après validation du moteur de recherche";
        next(error);
    }
});



// Pour récupérer les filtres utiles pour produits trouvés à partir du moteur de recherche
router.get("/searchstring/filters/:searchText", async (req, res, next) => {
    try {
        const stage = {
            $search: {
                'index': 'products', 
                'text': {
                    'query': req.params.searchText, 
                    'path': [
                        'intitule', 
                        'marque'
                    ]
                }
            }
        };

        const filters = await getFilters(stage);
        res.json(filters);
    } catch (error) {
        error.customMsg = "Etape de récupération des filtres sur produits affichés après recherche";
        next(error);
    }
});



// Pour alimenter l'autocomplete du moteur de recherche principal en haut de page
router.get("/autocomplete/products/:searchText", (req, res, next) => {
    const searchText = req.params.searchText;

    requests.getAutocompleteData(searchText)
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            error.customMsg = "Erreur lors de l'étape d'alimentation des suggestions de produits après saisie dans le moteur de recherche";
            next(error);
        })
});



// Qd clic sur un article dans autocomplete du moteur de recherche
router.get("/product/:id", (req, res, next) => {       
    const id = req.params.id;
    const stage = { 'match':{ _id: new ObjectId(id) } };

    // On passe en argument l'objet 'stage' utile pour la construction de la requete
    requests.getProducts(stage)
        .then(result => {   
            res.json(result);
        })
        .catch(error => { 
            error.customMsg = "Erreur lors de l'étape de récupération d'un produit à partir de la liste des suggestions du moteur de recherche";
            next(error);
        });
});


module.exports = router;