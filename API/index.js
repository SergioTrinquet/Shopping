const express = require('express');
const app = express();
const port = process.env.PORT || 3080;

const erreur = require('./app_modules/erreur');

const config = require("./config/identifiants_mongoDB.js");
const mongoose = require('mongoose');
const Product = require('./models/product');
const ObjectId = mongoose.Types.ObjectId;

const requests = require('./requests');


// on précise ici qu'on autorise toutes les sources
// puis dans le second header, quels headers http sont acceptés
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Fonctions Middleware permettant d'interpréter les paramètres POST 'req.body' 
// (to support JSON-encoded and URL-encoded bodies)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Chaine de connexion à MongoDB
//console.log(config.username + " " + config.password + " " + config.db); //TEST
const dbURI = `mongodb+srv://${config.username}:${config.password}@clustershopping.z06ey.mongodb.net/${config.db}?retryWrites=true&w=majority`;
// Connection à mongoDB avec la surcouche mangoose
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(port, () => {
            console.log("J'écoute au port " + port); //TEST
        })
    })
    .catch(err => {
        console.log("Erreur de connexion"); 
        // Appeler ici 'next(err)'
    });



// Pour alimenter marge 'rayons'
app.get("/departments", (req, res, next) => {
    requests.getDepartments
        .then(result => {
            res.json(result);
        })
        .catch(error => { 
            error.customMsg = "Erreur lors de l'étape du chargement de la liste des rayons";
            next(error);
        });
});




// Pour récupérer les filtres utiles selon rayon sélectionné (marge gauche qd produits affichés)
app.get("/department/filters/:id_dpt", async (req, res, next) => {
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




// Pour récupérer les filtres utiles pour produits trouvés à partir du moteur de recherche
app.get("/searchstring/filters/:searchText", async (req, res, next) => {
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





// Pour récupérer les produits d'un rayon
app.get("/department/products", async (req, res, next) => {
    try {

        let sortStageDefaultArgument = { intitule: 1 };
        const mongodbStageArguments = buildMongodbStageArguments(req.query, sortStageDefaultArgument);

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



// Qd validation sur moteur de recherche : Clic sur icone de recherche (loupe) du moteur de recherche ou touche 'entrée' pour validation saisie
app.get("/searchstring/products", async (req, res, next) => {    
    try {
        const searchText = req.query.searchstring;
        delete req.query.searchstring; // Suppression param 'searchstring' de req.query pour 

        let sortStageDefaultArgument = { score: -1 };
        const mongodbStageArguments = buildMongodbStageArguments(req.query, sortStageDefaultArgument);

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



// Pour alimenter l'autocomplete du moteur de recherche principal en haut de page
app.get("/autocomplete/products/:searchText", (req, res, next) => {
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
app.get("/product/:id", (req, res, next) => {       
    const id = req.params.id;
    const stage = { 'match':{ _id: new ObjectId(id) } };

    // On passe en argument l'objet 'stage' utile pour la construction de la requete
    requests.getProducts(stage)
        .then(result => {   console.log("Prd from Autocomplete", result); //TEST
            res.json(result);
        })
        .catch(error => { 
            error.customMsg = "Erreur lors de l'étape de récupération d'un produit à partir de la liste des suggestions du moteur de recherche";
            next(error);
        });
});





// Appelé qd coté front, sélection rayon, ou saisie recherche produit (validat° chp de recherche ou click produit dans autocomplete) : 
// Requetes pour obtenir les filtres correspondants aux produits affichés ainsi que nbr de produit(s) propre à chaque filtre
const getFilters = (stage) => {
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
            //for(const [key, value] of Object.entries(result)) {
            //    console.log("result =>", key, value); //TEST
            //}
            const [key, value] = Object.entries(result)[0];
            filters[key] = value;
        }
        //console.log("filters >>>>>", filters); //TEST
        return filters;
    })
    .catch(error => {
        throw error
    })
}



// Construction des stages de pipeline pour requete MongoDB, à partir des paramètres passés en GET
const buildMongodbStageArguments = (query, sortStageArgument) => {
    let matchStageArguments = {};

    // Boucle sur paramètres passés
    for(let p in query) {
        //console.log("=>", p, query[p],"isArray : " + Array.isArray(query[p]) , "type valeur: " + typeof(query[p])); // TEST

        if(Array.isArray(query[p])) { // Si c'est un Array (plusieurs nutriscore ou labels qualité ou marques cochées)...
                    
            let tabMongoDBclause = [];
            for(const x of query[p]) {
                // Si 'nutriscore' ou 'label_qualite', ajout '_id' pour chercher ds sous-document le path '_id'
                p = (p == "nutriscore" || p == "label_qualite" ? p + '._id' : p);
                tabMongoDBclause.push({ [p]: x }); // Entre [] pour que propriété de l'obj. soit interprétée, sinon lit 'p'
            }
            matchStageArguments["$or"] = tabMongoDBclause;

        } else if(typeof query[p] == 'string') { // ...Sinon si c'est un String (un seul nutriscore coché, un seul label qualité coché, une seule marque cochée, promotions, prds français)...
            
            // Paramètre pour le classement de produits
            if(p == "tri") {
                const triParams = new URLSearchParams(query[p]); // Parsing de la string avec les paramètres propres au tri
                const champBdd = triParams.get("champBdd");
                const ordre = triParams.get("ordre");
                sortStageArgument = { [champBdd]: parseInt(ordre) };

            // Paramètres pour le filtrage de produits
            } else {
                if(p == "promos") {
                    matchStageArguments["promotion"] = { $exists: true,  $nin: ["", {}, null] } // Check présence prop. 'promotion'
                } else if(p == "prdsFr") {
                    matchStageArguments["origine"] = "FRANCE";
                } else if(p == "nutriscore" || p == "label_qualite") { 
                    matchStageArguments[p + "._id"] = query[p]; 
                } else if(p == "rayon") { // Cas juste qd recherche à partir de la sélection d'un rayon
                    matchStageArguments[p] = new ObjectId(query[p]);
                } else { // marque
                    matchStageArguments[p] = query[p]; 
                }
            }

        }
    }

    console.log("matchStageArguments", matchStageArguments); //TEST
    console.log("sortStageArgument", sortStageArgument); //TEST

    return { 
        "matchStage": matchStageArguments, 
        "sortStage": sortStageArgument 
    }
}







app.use(erreur); // Middleware de gestion des erreurs

