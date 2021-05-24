const express = require('express');
const app = express();
const port = process.env.PORT || 3080;

const erreur = require('./app_modules/erreur');

const mockData = require('./mockData/mock'); // Variables mock juste pour phase de dev.

const config = require("./config/identifiants_mongoDB.js");
const mongoose = require('mongoose');
const Department = require('./models/department');
const Product = require('./models/product');
const Nutriscore = require('./models/nutriscore').model;
const LabelQualite = require('./models/labelQualite').model;
//console.log(LabelQualite); //TEST


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

// Pour récupérer les produits d'un rayon
app.get("/department_products/:rayonId", (req, res, next) => {
    
    // === Version avec Mock === //
    /* try {
        const produitsDuRayon = mockData.produits.filter(p => p.rayon.id == req.params.rayonId);
        res.json(produitsDuRayon);
    } catch (error) {
        error.customMsg = "Erreur lors de l'étape de récupération des produits d'un rayon";
        next(error);
    } */

    // === Version avec data dans mongoDB === //
    Product
        .find({rayon: req.params.rayonId}) // Bonne version !!
        //.find({"rayon": ObjectId(req.params.rayonId)}) // Mauvaise version
        .populate("rayon")
        .then(result => {
            res.json(result);
        })
        .catch(error => { 
            error.customMsg = "Erreur lors de l'étape de récupération des produits d'un rayon";
            next(error);
        });

});


// Pour récupérer les produits d'un rayon après sélection de filtre(s)
app.post("/department_products", (req, res, next) => {
    /* try {
        //TEST
        console.log("id rayon", req.body.department); //TEST
        console.log(JSON.stringify(req.body)); 
        res.status(200).send("No problem !!");
    } catch (error) {
        error.customMsg = "Etape de récupération des filtres (partie 'Nutriscore' ou/et 'LabelQualite')";
        next(error);
    } */

    
    console.log("Paramètres passés en POST >>>", JSON.stringify(req.body)); // TEST
    let clauseFind = {};

    // NOTE:
    // Si param = 'promos' => Check présence propriété 'Promotion', et si présente, check si pas vide (en testant présence prop. 'pourcent')

    // Boucle sur paramètres passés
    for(let rb in req.body) {

        //console.log("=>", rb, req.body[rb],"isArray : " + Array.isArray(req.body[rb]) , "type valeur: " + typeof(req.body[rb])); // TEST

        // Si paramètre passé est un tableau (nutriscore, labels qualité, marque)...
        if(Array.isArray(req.body[rb])) { // Si c'est un Array...

            console.log("Array => ", rb, req.body[rb]); //TEST
            let tabMongoDBclause = [];
            for(const x of req.body[rb]) {
                // Si 'nutriscore' ou 'label_qualite', ajout '_id' pour chercher ds sous-document le path '_id'
                rb = (rb == "nutriscore" || rb == "label_qualite" ? rb + '._id' : rb);
                tabMongoDBclause.push({ [rb]: x }); // entre [] pour que propriété de l'obj. soit interprété, sinon lit 'rb'
            }
            clauseFind["$or"] = tabMongoDBclause;

        } else if(typeof req.body[rb] == 'string') { // ...Si c'est un String (nutriscore, labels qualité, marque,promotions, prds français)...

            console.log("string => ", rb, req.body[rb]); //TEST
            if(rb == "promos") {
                clauseFind["promotion.pourcent"] = { $exists:true }
            } else if(rb == "prdsFr") {
                clauseFind["origine"] = "FRANCE";
            } else if(rb == "nutriscore" || rb == "label_qualite") { 
                clauseFind[rb + "._id"] = req.body[rb];      
            } else {
                clauseFind[rb] = req.body[rb]; 
            }

        } /* else if(req.body[rb] = Object(req.body[rb])) { // ...Si c'est un objet

            console.log("Object => ", rb, req.body[rb]); //TEST
            clauseFind[rb]._id = req.body[rb];

        } */
    }
    console.log("clauseFind", clauseFind); //TEST


    Product
        //.find({ "rayon": req.body.rayon })
        //.find({ 'rayon': '60907d7d42b2205d269d7df8', 'nutriscore._id': 'n1' }) // FONCTIONNE !!!
        //.find({ rayon: '60907d7d42b2205d269d7df8',  nutriscore: {_id: 'n1'} }) // NE FONCTIONNE PAS !!!
        .find(clauseFind).sort('intitule')
        .populate("rayon")
        .then(result => {
            res.json(result);
        })
        .catch(error => { 
            error.customMsg = "Erreur lors de l'étape de récupération des produits d'un rayon";
            next(error);
        });
})


// Pour récupérer les filtres (marge gauche qd produits affichés)
app.get("/filters", async (req, res, next) => {
    /* 
    // Pour TEST pour vérifier que les prommesses s'executent de façon parallèle
    const result_nutriscore = new Promise((resolve, reject) => {
        setTimeout(
            resolve, 5000, 
            Nutriscore.find().sort('lettre').then(n => { return {"nutriscore": n} }) 
        )
    });
    const result_labelqualite = new Promise((resolve, reject) => {
        setTimeout(
            resolve, 4000, 
            LabelQualite.find().sort('label').then(l => { return {"label_qual": l} }) 
        )
    });
    const result_marques = new Promise((resolve, reject) => {
        setTimeout(
            resolve, 6000,  
            Product.distinct("marque").then(marques => {
            return { "marques": marques.filter(m => m.length > 0).sort() }
        }) );
    }); 
    */
    const result_nutriscore = Nutriscore.find().sort('lettre').then(scores => {
        return { "nutriscore": scores }
    });
    const result_labelqualite = LabelQualite.find().sort('label').then(labels => {
        return { "label_qual": labels }
    });
    const result_marques = Product.distinct("marque").then(marques => {
        return { "marques": marques.filter(m => m.length > 0).sort() }
    });

    // Execution requetes mongoDB qui sont des promesses en parallèle
    Promise.all([
        result_nutriscore, 
        result_labelqualite, 
        result_marques
    ])
    .then(values => {
        let filters = {};
        for(const result of values) {
            // for(const [key, value] of Object.entries(result)) {
            //    console.log("result =>", key, value); //TEST
            //}
            const [key, value] = Object.entries(result)[0];
            filters[key] = value;
        }
        //console.log("filters >>>>>", filters); //TEST
        res.json(filters);
    })
    .catch(error => {
        error.customMsg = "Etape de récupération des filtres (partie 'Nutriscore' ou/et 'LabelQualite')";
        next(error);
    })

});




app.use(erreur); // Middleware de gestion des erreurs

