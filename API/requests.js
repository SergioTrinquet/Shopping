const Department = require('./models/department');
const Product = require('./models/product');

// Liste des requetes mongoDB
module.exports = {

    // Pour alimenter marge 'rayons'
    getDepartments:
        Department
            .find()
            .sort("intitule")
    ,
    
    
    // Récupération filtres 'nutriscore' en fonction des produits affichés
    getNutriscoreFilter: (stage) => {
        return Product.aggregate([
                stage,
                {
                    // Filtre sur les produits ayant une propriété 'nutriscore' qui n'est ni vide, ni null
                    $match: { 
                        nutriscore: { $exists: true,  $nin: ["", null] } 
                    }
                },
                { 
                    // On groupe par nutriscore._id', on incrémente à chaque fois de 1, et on récupère ts les champs de Product du 1er doc correspondant aux ._id groupés
                    $group: { 
                        _id: "$nutriscore._id", 
                        total: { $sum: 1 }, 
                        otherFields: { $first: "$$ROOT" } 
                    } 
                },
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
    },



    // Récupération filtres 'label qualité' en fonction des produits affichés
    getLabelsQualiteFilter: (stage) => {
        return Product.aggregate([
                stage,
                { 
                    $match: { 
                        label_qualite: { $exists: true,  $nin: ["", null] } 
                    }
                },
                { 
                    $unwind: "$label_qualite" 
                },
                { 
                    $group: { 
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
                { 
                    $sort: { libelle: 1 } 
                }
            ])
    },



    // Récupération filtres 'marques' en fonction des produits affichés
    getMarquesFilter: (stage) => {
        return Product
                .aggregate([
                    stage,
                    {
                        $match: { 
                            marque: { $exists: true, $nin: ["", null] }
                        } 
                    },
                    { 
                        $project: { marque: 1 } 
                    }, 
                    { 
                        $group: { _id: "$marque", total: { $sum: 1 } } 
                    },
                    { 
                        // On renomme le champ '_id' par 'libelle' 
                        $project: {
                                _id: 0, 
                                libelle: "$_id", 
                                total: "$total"
                            } 
                    },
                    { 
                        $sort: { libelle: 1 } 
                    }
                ])
    },



    // Récupération filtres 'Produits français' en fonction des produits affichés
    getProduitsFRfilter: (stage) => {
        return Product
                .aggregate([
                    stage,
                    { 
                        $match: { origine: "FRANCE" }
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
    },



    // Récupération filtres 'Promotions' en fonction des produits affichés
    getPromosFilter: (stage) => {
        return Product
                .aggregate([
                    stage,
                    { 
                        $match: { 
                            "promotion": { $exists: true,  $nin: ["", {}, null] }  
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
    },


    // Récupération données produit(s) : Appelé qd clic sur rayon, ou qd rech; ds moteur de rech, ou qd clic sur un article dans autocomplete du moteur de recherche
    getProducts: (stages) => {
        let aggregationPipelineStages = [
                    {   
                        // Stage '$lookup' pour faire un 'join' sur la collection 'departments' et récupérer l'intitulé des rayons
                        $lookup: {
                            from: 'departments',
                            localField: 'rayon',
                            foreignField: '_id',
                            as: 'rayon'
                        }
                    },
                    {
                        // Stage pour afficher les champs requis
                        $project: {
                            'intitule': 1,
                            'descriptif': 1,
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
                            'rayon': { $arrayElemAt: [ "$rayon", 0 ] }, // Pour 'aplatir' (flatten) l'array généré par le stage '$lookup' juste avant celui-ci
                            'nutriscore': 1,
                            'label_qualite': 1,
                            'promotion': 1
                        }
                    }, 
                    { 
                        // Stage de création du champ 'prix_final' qui correspond au prix après promotion en pourcent si existe, sinon prix normal : Nécéssaire pour tri sur prix
                        $addFields: {
                            'prix_final': {
                                $cond: {
                                    if: { $eq: [ { $isNumber : "$promotion.pourcent" }, true ] },
                                    then: { 
                                        // Ici calcul du pourcentage de réduction pour déterminer prix après promotion => (prix * (100 - promotion.pourcent)) / 100
                                        $divide: 
                                        [
                                            {
                                                $multiply: 
                                                [ 
                                                    '$prix',
                                                    {
                                                        $subtract: [
                                                            100,
                                                            "$promotion.pourcent"
                                                        ]

                                                    }
                                                ]
                                            }
                                            , 
                                            100
                                        ] 
                                    },
                                    // else: "$$REMOVE" // retire le champ 'prix_final'
                                    else: '$prix'
                                }
                            }, 

                            // Pour que le tri par intitulé ne soit pas faussé à cause de certains intiulés avec des maj. et pas d'autres
                            'intitule_insensitive': { 
                                '$toLower': '$intitule' 
                            }
                        }
                    }
                ];



        // Ordre pour les 2 premières conditions, et pour les 2 dernières, est important : Si stage 'search' présent, 
        // il doit être intégré à la première place. De même si 'addFields' présent, doit être intégré avant 'sort', sionon erreur. 
        if("match" in stages) {
            aggregationPipelineStages.unshift({ $match: stages.match });
        }
        if("search" in stages) {
            aggregationPipelineStages.unshift({ $search: stages.search });
        }
        if("addFields" in stages) {
            aggregationPipelineStages.push({ $addFields: stages.addFields });
        }
        if("sort" in stages) {
            aggregationPipelineStages.push({ $sort: stages.sort });
        }

        return Product.aggregate(aggregationPipelineStages);
    },


    getAutocompleteData: (searchText) => {
        // Recherche sur 2 champ mais sans autocomplete
        // Fait avec un index dynamique (index par défaut)
        /* return Product.aggregate([
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
                'intitule_insensitive': {  
                    '$toLower': '$intitule' 
                }, 
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
        ]) */


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
                    'intitule_insensitive': {  
                        '$toLower': '$intitule' 
                    },
                    'marque': 1,
                    'score': {
                        '$meta': 'searchScore'
                    }
                }
            }, 
            { $limit': 20 }
        ])
        */


        // Autocomplete sur 2 champs (intitule et marque), donc utilisation de 'compound' avec créat° dans mongodb ATLAS d'un index sur les 2 champs pré-cités
        // 'should' dans le compound permet de retourner des résultats  même si une seule clause sur les 2 est valide (ici les 2 'autocomplete')
        // 'fuzzy' pour permettre de trouver des résultats malgr une marge d'erreur dans la saisie: Affiche notamment produits ayant 1 caractère différent par rapport à la recherche validée (paramétré avec prop. 'maxEdits')
        // Highlight possible que parce que dans la construction de l'index, j'ai ajouté pour le champ 'intitule' le data Type 'String' au data Type 'Autocomplete'
        return Product.aggregate([
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
                'intitule_insensitive': {  
                    '$toLower': '$intitule' 
                },
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
                    'intitule_insensitive': 1
                }
            },
            {
              '$limit': 20
            }
        ])
    }

}