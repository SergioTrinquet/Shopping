const express = require('express');
const app = express();
const port = process.env.PORT || 3081;

const erreur = require('./app_modules/erreur');

const config = require("./config/identifiants_mongoDB.js");
const mongoose = require('mongoose');
const Product = require('./models/product');

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
    const id_department = req.params.id_dpt;
    const ObjectId = mongoose.Types.ObjectId;

    const pipeline = { $match: { rayon: new ObjectId(id_department) } };

    try {
        const filters = await getFilters(pipeline);
        res.json(filters);
    } catch (error) {
        error.customMsg = "Etape de récupération des filtres par rayon";
        next(error);
    }
});




// Pour récupérer les filtres utiles pour produits trouvés à partir du moteur de recherche
app.get("/searchstring/filters/:searchText", async (req, res, next) => {
    const pipeline = {
        '$search': {
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

    try {
        const filters = await getFilters(pipeline);
        res.json(filters);
    } catch (error) {
        error.customMsg = "Etape de récupération des filtres sur produits affichés après recherche";
        next(error);
    }
});





// Pour récupérer les produits d'un rayon
app.get("/department/products", (req, res, next) => {
    let queryMethodFind = {};
    let queryMethodSort = "intitule";
    console.log("req.query", req.query); //TEST

    // Boucle sur paramètres passés
    for(let p in req.query) {
        //console.log("=>", p, req.query[p],"isArray : " + Array.isArray(req.query[p]) , "type valeur: " + typeof(req.query[p])); // TEST

        if(Array.isArray(req.query[p])) { // Si c'est un Array...
            
            let tabMongoDBclause = [];
            for(const x of req.query[p]) {
                // Si 'nutriscore' ou 'label_qualite', ajout '_id' pour chercher ds sous-document le path '_id'
                p = (p == "nutriscore" || p == "label_qualite" ? p + '._id' : p);
                tabMongoDBclause.push({ [p]: x }); // entre [] pour que propriété de l'obj. soit interprété, sinon lit 'p'
            }
            queryMethodFind["$or"] = tabMongoDBclause;

        } else if(typeof req.query[p] == 'string') { // ...Si c'est un String (nutriscore, labels qualité, marque, promotions, prds français)...
            
            // Paramètre pour le classement de produits
            if(p == "tri") {
                const triParams = new URLSearchParams(req.query[p]); // Parsing de la string avec les paramètres propres au tri
                const champBdd = triParams.get("champBdd");
                const ordre = triParams.get("ordre");
                queryMethodSort = { [champBdd]: ordre };
            // Paramètres pour le filtrage de produits
            } else {
                if(p == "promos") {
                    queryMethodFind["promotion.pourcent"] = { $exists:true } // Chck présence prop. pourcent permet par la même occasion de savoir si présence prop. 'promotion'
                } else if(p == "prdsFr") {
                    queryMethodFind["origine"] = "FRANCE";
                } else if(p == "nutriscore" || p == "label_qualite") { 
                    queryMethodFind[p + "._id"] = req.query[p];      
                } else { // rayon et marque
                    queryMethodFind[p] = req.query[p]; 
                }
            }

        }

    }

    //console.log("queryMethodFind", queryMethodFind); //TEST


    Product
        //.find({rayon: req.query.rayon}) // FONCTIONNE !!!
        //.find({"rayon": ObjectId(req.params.rayon)})  // NE FONCTIONNE PAS !!!
        //.find({ 'rayon': '60907d7d42b2205d269d7df8', 'nutriscore._id': 'n1' }) // FONCTIONNE !!!
        //.find({ rayon: '60907d7d42b2205d269d7df8',  nutriscore: {_id: 'n1'} }) // NE FONCTIONNE PAS !!!
        .find(queryMethodFind)
        .sort(queryMethodSort)
        .populate("rayon")
        .then(result => {
            res.json(result);
        })
        .catch(error => { 
            error.customMsg = "Erreur lors de l'étape de récupération des produits d'un rayon";
            next(error);
        });

});



// Qd validation sur moteur de recherche : Clic sur icone de recherche (loupe) du moteur de recherche ou touche 'entrée' pour validation saisie
app.get("/searchEngine/products", (req, res, next) => {    
    const searchText = req.query.searchstring;
    delete req.query.searchstring; // On supprime cette propriété ds le but de factoriser code commun ci-dessous avec celui de l'API "/department/products"

    let queryMethodFind = {};
    let queryMethodSort = "score";

    // Boucle sur paramètres passés
    for(let p in req.query) {
        //console.log("=>", p, req.query[p],"isArray : " + Array.isArray(req.query[p]) , "type valeur: " + typeof(req.query[p])); // TEST

        if(Array.isArray(req.query[p])) { // Si c'est un Array...
                    
            let tabMongoDBclause = [];
            for(const x of req.query[p]) {
                // Si 'nutriscore' ou 'label_qualite', ajout '_id' pour chercher ds sous-document le path '_id'
                p = (p == "nutriscore" || p == "label_qualite" ? p + '._id' : p);
                tabMongoDBclause.push({ [p]: x }); // entre [] pour que propriété de l'obj. soit interprété, sinon lit 'p'
            }
            queryMethodFind["$or"] = tabMongoDBclause;

        } else if(typeof req.query[p] == 'string') { // ...Si c'est un String (nutriscore, labels qualité, marque, promotions, prds français)...
            
            // Paramètre pour le classement de produits
            if(p == "tri") {
                /* const triParams = new URLSearchParams(req.query[p]); // Parsing de la string avec les paramètres propres au tri
                const champBdd = triParams.get("champBdd");
                const ordre = triParams.get("ordre");
                queryMethodSort = { [champBdd]: ordre }; */
                
            // Paramètres pour le filtrage de produits
            } else {
                if(p == "promos") {
                    queryMethodFind["promotion.pourcent"] = { $exists:true } // Chck présence prop. pourcent permet par la même occasion de savoir si présence prop. 'promotion'
                } else if(p == "prdsFr") {
                    queryMethodFind["origine"] = "FRANCE";
                } else if(p == "nutriscore" || p == "label_qualite") { 
                    queryMethodFind[p + "._id"] = req.query[p];      
                } else { // marque
                    queryMethodFind[p] = req.query[p]; 
                }
            }

        }
    }

    console.log("queryMethodFind", queryMethodFind); //TEST

    const pipeline = queryMethodFind !== {} ? { '$match': queryMethodFind } : "";


    Product.aggregate([
        {
            '$search': {
                'index': 'products', 
                'text': {
                    'query': searchText, 
                    'path': [
                        'intitule', 
                        'marque'
                    ]
                }
            }
        }, 
        pipeline,
        {   // Pipeline '$lookup' pour faire un 'join' sur la collection 'departments' et récupérer l'intitulé des rayons
            $lookup: {
                from: 'departments',
                localField: 'rayon',
                foreignField: '_id',
                as: 'rayon'
            }
        },
        {
            '$project': {
                'descriptif': 1,
                'intitule': 1, 
                'marque': 1, 
                'nom_image': 1,
                // Convertion des 'prix' et 'prix_unite' en 'double', sinon bug du coté front avec '.toFixed()'
                'prix': {
                    $convert: {
                        input: '$prix',
                        to: 'double'
                    }
                },
                'prix_unite': {
                    $convert: {
                        input: '$prix_unite',
                        to: 'double'
                    }
                },
                'unite': 1,
                'origine': 1,
                'rayon': { $arrayElemAt: [ "$rayon", 0 ] }, // Pour 'aplatir' (flatten) l'array généré par le pipeline '$lookup' juste avant celui-ci
                'nutriscore': 1,
                'label_qualite': 1,
                'promotion': 1,
                'score': {
                    '$meta': 'searchScore'
                }
            }
        }, 
        {
            '$sort': {
                'score': -1,
                'intitule': 1
            }
        }
    ])
    .then(result => {
        res.json(result);
    })
    .catch(error => {
        error.customMsg = "Erreur lors de l'étape de récupération des produits après validation du moteur de recherche";
        next(error);
    })
});



// Pour alimenter l'autocomplete du moteur de recherche principal en haut de page
app.get("/autocomplete/products/:searchText", (req, res, next) => {
    const searchText = req.params.searchText;

    // Recherche sur 2 champ mais sans autocomplete
    // Fait avec un index dynamique (index par défaut)
    /* Product.aggregate([
        {
          '$search': {
            'index': 'index_products', 
            'text': {
              'query': searchText, 
              'path': [
                'intitule', 'marque'
              ]
            }, 
            'highlight': {
              'path': [
                'intitule', 'marque'
              ]
            }
          }
        }, 
        {
          '$project': {
            'intitule': 1, 
            'marque': 1, 
            'score': {
              '$meta': 'searchScore'
            }, 
            'highlight': {
              '$meta': 'searchHighlights'
            }
          }
        }, 
        { '$limit': 20 }
    ])
    .then(result => {res.json(result)})
    .catch(error => {
        error.customMsg = "Erreur lors de l'étape de récupération des produits à partir du champ de recherche d'un produit";
        next(error);
    }) */


    // Autocomplete avec recherche sur un seul champ
    /*  
    Product.aggregate([
    {
        '$search': {
        'index': 'products_intitule_autocomplete', 
        'autocomplete': {
            'query': searchText, 
            'path': 'intitule',
            "fuzzy": {
                "maxEdits": 2,
                "prefixLength": 1
            }
        }
        }
    }, 
    {
        '$project': {
        'intitule': 1, 
        'marque': 1,
        'score': {
            '$meta': 'searchScore'
        }
        }
    }, 
    { $limit': 20 }
    ]).then(result => {res.json(result)})
    .catch(error => {
        error.customMsg = "Erreur lors de l'étape de récupération des produits à partir du champ de recherche d'un produit";
        next(error);
    }) 
    */

    // Autocomplete sur 2 champs (intitule et marque), donc utilisation de 'compound' avec créat° dans mongodb ATLAS d'un index sur les 2 champs pré-cités
    // 'should' dans le compound permet de retourner des résultats  même si une seule clause sur les 2 est valide (ici les 2 'autocomplete')
    // 'fuzzy' pour permettre de trouver des résultats malgr une marge d'erreur dans la saisie: Affiche notamment produits ayant 1 caractère différent par rapport à la recherche validée (paramétré avec prop. 'maxEdits')
    // Highlight possible que parce que dans la construction de l'index, j'ai ajouté pour le champ 'intitule' le data Type 'String' au data Type 'Autocomplete'
    Product.aggregate([
        {
          '$search': {
            'index': 'products_autocomplete',
            'compound': {
                'should': [
                    {
                        'autocomplete': {
                            'query': searchText, 
                            'path': 'intitule',
                            "fuzzy": {
                                "maxEdits": 1,
                                "prefixLength": 1
                            }
                        }
                    },
                    {
                        'autocomplete': {
                            'query': searchText, 
                            'path': 'marque',
                            "fuzzy": {
                                "maxEdits": 1,
                                "prefixLength": 1
                            }
                        }
                    }
                ]
            },
            'highlight': {
                'path': ['intitule', 'marque']
            }
          }
        }, 
        {
          '$project': {
            'intitule': 1, 
            'marque': 1,
            'score': {
                '$meta': 'searchScore'
            }, 
            'highlight': {
              '$meta': 'searchHighlights'
            }
          }
        }, 
        {
            '$sort': {
                'score': -1,
                'intitule': 1
            }
        },
        {
          '$limit': 20
        }
    ])
    .then(result => {
        //console.log("result", result); //TEST
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

    requests.getProductFromId(id)
                .then(result => {
                    res.json(result);
                })
                .catch(error => { 
                    error.customMsg = "Erreur lors de l'étape de récupération d'un produit à partir de la liste des suggestions du moteur de recherche";
                    next(error);
                });
});





// Appelé qd coté front, sélection rayon, ou saisie recherche produit (validat° chp de recherche ou click produit dans autocomplete) : 
// Requetes pour obtenir les filtres correspondants aux produits affichés ainsi que nbr de produit(s) propre à chaque filtre
const getFilters = (pipeline) => {
    // Requete pour obtenir les differents scores Nuriscores des produits, et leurs nombres respectifs  
    const result_nutriscore = requests.getNutriscoreFilter(pipeline)
                                .then(scores => {
                                    return { "nutriscore": scores }
                                }); 


    // Requete pour obtenir les differents labels qualité des produits, et leurs nombres respectifs  
    const result_labelqualite = requests.getLabelsQualiteFilter(pipeline)
                                    .then(labels => {
                                        return { "label_qual": labels }
                                    });


    // Requete pour obtenir les differentes marques des produits, et leurs nombres respectifs
    const result_marques = requests.getMarquesFilter(pipeline)
                                .then(marques => {
                                    return { "marques": marques }
                                });


    // Requete pour savoir si Produits Français existent parmi les produits, et leur nombre
    const produitsFR_present = requests.getProduitsFRfilter(pipeline)
                                .then(prdsFR => {
                                    return {  "ProduitsFRpresence": prdsFR[0] }
                                });


    // Requete pour savoir s'il y a des Promotions pour les produits, et leur nombre
    const promos_present = requests.getPromosFilter(pipeline)
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
        console.log("filters >>>>>", filters); //TEST
        return filters;
    })
    .catch(error => {
        throw error
    })
}











app.use(erreur); // Middleware de gestion des erreurs

