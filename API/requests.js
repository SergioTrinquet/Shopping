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



    // Récupération filtres 'label qualité' en fonction des produits affichés
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



    // Récupération filtres 'marques' en fonction des produits affichés
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



    // Récupération filtres 'Produits français' en fonction des produits affichés
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



    // Récupération filtres 'Promotions' en fonction des produits affichés
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
    },


    // Récupération données produit à partir de son id : Qd clic sur un article dans autocomplete du moteur de recherche
    getProductFromId: (id) => {
        return Product
                    .find({ _id: id })
                    .populate("rayon")
    }

}