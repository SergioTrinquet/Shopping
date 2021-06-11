const express = require('express');
const app = express();
const port = process.env.PORT || 3080;

const erreur = require('./app_modules/erreur');

//const mockData = require('./mockData/mock'); // Variables mock juste pour phase de dev.

const config = require("./config/identifiants_mongoDB.js");
const mongoose = require('mongoose');
const Department = require('./models/department');
const Product = require('./models/product');
const Nutriscore = require('./models/nutriscore').model;
const LabelQualite = require('./models/labelQualite').model;


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
    // === Version avec Mock === //
    /* try {
        res.json(mockData.rayons); 
    } catch (error) {
        error.customMsg = "Erreur lors de l'étape du chargement de la liste des rayons";
        next(error);
    } */

    // === Version avec data dans mongoDB === //
    Department.find().sort("intitule")
    .then(result => {
        res.json(result);
        //console.log(result); //TEST
    })
    .catch(error => { 
        error.customMsg = "Erreur lors de l'étape du chargement de la liste des rayons";
        next(error);
    });

});




// Pour récupérer les filtres utiles selon rayon sélectionné (marge gauche qd produits affichés)
app.get("/filters/:department_id", async (req, res, next) => {
    /* 
    // TEST pour vérifier que les promesses s'executent de façon parallèle
    const result_nutriscore = new Promise((resolve, reject) => {
        setTimeout( resolve, 5000, 
            Nutriscore.find().sort('lettre').then(n => { return {"nutriscore": n} }) )
    });
    */

    const id_department = req.params.department_id;
    const ObjectId = mongoose.Types.ObjectId;

    // Requete pour obtenir les differents nutriscores des produits d'un rayon, et leurs nombres respectifs
    const result_nutriscore = Product
        .aggregate([
            { $match: { 
                    rayon: new ObjectId(id_department),
                    nutriscore: { $exists: true,  $nin: ["", null] }
                } 
            },
            { 
                $group: { 
                    _id: "$nutriscore._id", 
                    total: {$sum: 1}, 
                    otherFields: { $first: "$$ROOT" } 
                } 
            }, // On groupe par nutriscore._id', on incrémente à chaque fois de 1, et on récupère ts les champs de Product du 1er doc correspondant aux ._id groupés
            { 
                $project: { 
                    id: "$_id",  
                    lettre: "$otherFields.nutriscore.lettre", 
                    total: "$total", 
                    _id: 0 
                } 
            },
            { 
                $sort: { lettre: 1 } 
            }
            
        ])
        .then(scores => {
            return { "nutriscore": scores }
        });


    // Requete pour obtenir les differents labels qualité des produits d'un rayon, et leurs nombres respectifs  
    const result_labelqualite = Product
        .aggregate([
            { $match: { 
                    rayon: new ObjectId(id_department),
                    label_qualite: { $exists: true,  $nin: ["", null] }
                } 
            },
            { $unwind: "$label_qualite" },
            { $group: { 
                    _id: "$label_qualite", 
                    total: { $sum: 1 }
                } 
            }, 
            { $project: {
                    id: "$_id._id",
                    libelle: "$_id.label",
                    total: "$total",
                    _id: 0
                } 
            },
            { $sort: { libelle: 1 } }
        ])
        .then(labels => {
            return { "label_qual": labels }
        });


    // Requete pour obtenir les differentes marques des produits d'un rayon, et leurs nombres respectifs
    const result_marques = Product
        .aggregate([
            { 
                $match: { 
                    rayon: new ObjectId(id_department),
                    marque: { $exists: true, $nin: ["", null] }
                } 
            },
            { $project: { marque: 1 } }, 
            { $group: { _id: "$marque", total: { $sum: 1 } } },
            { $project: {_id: 0, libelle: "$_id", total: "$total"} }, // On renomme les champs
            { $sort: { libelle: 1 } }
        ])
        .then(marques => {
            return { "marques": marques }
        });


    // Requete pour savoir si Produits Français existent parmi les produits d'un rayon, et leur nombre
    const produitsFR_present = Product
        .aggregate([
            { 
                $match: { 
                    rayon: new ObjectId(id_department),
                    origine: "FRANCE"
                } 
            },
            { 
                $count: "total"
            },
            { 
                $project: {
                    exists: {
                        $cond: { 
                            if: { $gt: ["$total", 0] }, 
                            then: true, 
                            else: false 
                        }
                    },
                    total: "$total",
                    _id: 0
                } 
            }
        ])
        .then(prdsFR => {
            return {  "ProduitsFRpresence": prdsFR[0] }
        });


        // Requete pour savoir s'il y a des Promotions pour les produits d'un rayon, et leur nombre
        const promos_present = Product
            .aggregate([
                { 
                    $match: { 
                        rayon: new ObjectId(id_department),
                        "promotion.pourcent": { $exists: true,  $nin: ["", null] }
                    } 
                },
                { 
                    $count: "total"
                },
                { 
                    $project: {
                        exists: {
                            $cond: { 
                                if: { $gt: ["$total", 0] }, 
                                then: true, 
                                else: false 
                            }
                        },
                        total: "$total",
                        _id: 0
                    } 
                }
            ])
            .then(promos => {
                return {  "PromosPresence": promos[0] }
            });
     
    // Requetes mongoDB qui sont des promesses exécutées ici en parallèle
    Promise.all([
        result_nutriscore, 
        result_labelqualite, 
        result_marques,
        produitsFR_present,
        promos_present
    ])
    .then(values => {
        let filters = {};
        for(const result of values) {
            /* for(const [key, value] of Object.entries(result)) {
                console.log("result =>", key, value); //TEST
            } */
            const [key, value] = Object.entries(result)[0];
            filters[key] = value;
        }
        console.log("filters >>>>>", filters); //TEST
        res.json(filters);
    })
    .catch(error => {
        error.customMsg = "Etape de récupération des filtres par rayon";
        next(error);
    })
});




// Pour récupérer les produits d'un rayon
app.get("/department_products", (req, res, next) => {
    let clauseFind = {};
    let clauseSort = "intitule";
    console.log("req.query", req.query); //TEST

    // Boucle sur paramètres passés
    for(let rb in req.query) {
        console.log("=>", rb, req.query[rb],"isArray : " + Array.isArray(req.query[rb]) , "type valeur: " + typeof(req.query[rb])); // TEST

        if(Array.isArray(req.query[rb])) { // Si c'est un Array...
            
            let tabMongoDBclause = [];
            for(const x of req.query[rb]) {
                // Si 'nutriscore' ou 'label_qualite', ajout '_id' pour chercher ds sous-document le path '_id'
                rb = (rb == "nutriscore" || rb == "label_qualite" ? rb + '._id' : rb);
                tabMongoDBclause.push({ [rb]: x }); // entre [] pour que propriété de l'obj. soit interprété, sinon lit 'rb'
            }
            clauseFind["$or"] = tabMongoDBclause;

        } else if(typeof req.query[rb] == 'string') { // ...Si c'est un String (nutriscore, labels qualité, marque,promotions, prds français)...
            
            // Paramètre pour le classement de produits
            if(rb == "tri") {
                const triParams = new URLSearchParams(req.query[rb]); // Parsing de la string avec les paramètres propres au tri
                const champBdd = triParams.get("champBdd");
                const ordre = triParams.get("ordre");
                clauseSort = { [champBdd]: ordre };
            // Paramètres pour le filtrage de produits
            } else {
                if(rb == "promos") {
                    clauseFind["promotion.pourcent"] = { $exists:true } // Chck présence prop. pourcent permet par la même occasion de savoir si présence prop. 'promotion'
                } else if(rb == "prdsFr") {
                    clauseFind["origine"] = "FRANCE";
                } else if(rb == "nutriscore" || rb == "label_qualite") { 
                    clauseFind[rb + "._id"] = req.query[rb];      
                } else { // rayon et marque
                    clauseFind[rb] = req.query[rb]; 
                }
            }

        }

    }

    console.log("clauseFind", clauseFind); //TEST


    // === Version avec Mock === //
    /* try {
        const produitsDuRayon = mockData.produits.filter(p => p.rayon.id == req.params.rayonId);
        res.json(produitsDuRayon);
    } catch (error) {
        error.customMsg = "Erreur lors de l'étape de récupération des produits d'un rayon";
        next(error);
    } */
    

    Product
        //.find({rayon: req.query.rayon}) // FONCTIONNE !!!
        //.find({"rayon": ObjectId(req.params.rayon)})  // NE FONCTIONNE PAS !!!
        //.find({ 'rayon': '60907d7d42b2205d269d7df8', 'nutriscore._id': 'n1' }) // FONCTIONNE !!!
        //.find({ rayon: '60907d7d42b2205d269d7df8',  nutriscore: {_id: 'n1'} }) // NE FONCTIONNE PAS !!!
        .find(clauseFind)
        .sort(clauseSort)
        .populate("rayon")
        .then(result => {
            res.json(result);
        })
        .catch(error => { 
            error.customMsg = "Erreur lors de l'étape de récupération des produits d'un rayon";
            next(error);
        });

});



app.use(erreur); // Middleware de gestion des erreurs

