const express = require('express');
const app = express();
const port = process.env.PORT || 3080;

const erreur = require('./app_modules/erreur');

const mockData = require('./mockData/mock'); // Variables mock juste pour phase de dev.

const config = require("./config/mongoDB.js");
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
    .catch(err => console.log("Erreur de connexion"));



// Pour alimenter marge rayons
app.get("/get_rayons", (req, res, next) => {
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
app.get("/get_produits_rayon/:rayonId", (req, res, next) => {
    
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


// Pour récupérer les filtres (marge gauche qd produits affichés)
app.get("/get_filters", async (req, res, next) => {
    
    try {
        let filters = {};

        // ESSAYER D'INTERROGER LES TABLES EN PARALLELE !!!
        const result_nutriscore = await Nutriscore.find().sort('lettre');
        console.log("Nutriscore ===>", result_nutriscore); //TEST
        filters.nutriscore = result_nutriscore;

        const result_labelqualite = await LabelQualite.find().sort('label');
        console.log("LabelQualite ===>", result_labelqualite); //TEST
        filters.label_qual = result_labelqualite;

        let result_marques = await Product.distinct("marque");
        result_marques = result_marques.filter(m => m.length > 0);
        console.log("Marques produits ===>", result_marques.sort()); //TEST
        filters.marques = result_marques;

        res.json(filters);
    } catch (error) {
        error.customMsg = "Etape de récupération des filtres (partie 'Nutriscore' ou/et 'LabelQualite')";
        next(error);
    }

});

app.use(erreur); // Middleware de gestion des erreurs

