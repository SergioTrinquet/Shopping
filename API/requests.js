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
    
    
    // Récupération filtres utiles en fonction des produits affichés : Filtre Nutriscore
    getNutriscoreFilter: (pipeline) => {
        return Product.aggregate([
                pipeline,
                {
                    $match: { nutriscore: { $exists: true,  $nin: ["", null] } }
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
    },



    // Récupération filtres utiles en fonction des produits affichés : Filtre 'labels Qualité'
    getLabelsQualiteFilter: (pipeline) => {
        return Product.aggregate([
                pipeline,
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



    // Récupération filtres utiles en fonction des produits affichés : Filtre Marques
    getMarquesFilter: (pipeline) => {
        return Product
                .aggregate([
                    pipeline,
                    {
                        $match: { 
                            marque: { $exists: true, $nin: ["", null] }
                        } 
                    },
                    { $project: { marque: 1 } }, 
                    { $group: { _id: "$marque", total: { $sum: 1 } } },
                    { $project: {_id: 0, libelle: "$_id", total: "$total"} }, // On renomme les champs
                    { $sort: { libelle: 1 } }
                ])
    },



    // Récupération filtres utiles en fonction des produits affichés : Filtre 'Produits français'
    getProduitsFRfilter: (pipeline) => {
        return Product
                .aggregate([
                    pipeline,
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



    // Récupération filtres utiles en fonction des produits affichés : Filtre 'Produits français'
    getPromosFilter: (pipeline) => {
        return Product
                .aggregate([
                    pipeline,
                    { 
                        $match: { 
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
    }


}