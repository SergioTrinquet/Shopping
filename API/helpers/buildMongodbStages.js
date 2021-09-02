// Construction des stages de pipeline pour requete MongoDB, à partir des paramètres passés en GET

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = (query, sortStageArgument) => {
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