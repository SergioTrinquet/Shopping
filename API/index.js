const express = require('express');
const app = express();
const port = process.env.PORT || 3080;

const config = require("./config/mongoDB.js");
const mongoose = require('mongoose');
const Department = require('./models/department');
const Product = require('./models/product');

const mockData = require('./mockData/mock'); // Variables mock juste pour phase de dev.

const erreur = require('./app_modules/erreur');


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
    try {
        // === Version avec Mock ===
        //res.json(mockData.rayons); 

        // === Version avec data dans mongoDB ===
        Department.find().sort("intitule")
        .then(result => {
            res.json(result);
            console.log(result); //TEST
        })
        .catch(err => console.log("Erreur dans récupération des rayons dans collection mongoDB"));

    } catch (error) {
        error.customMsg = "Erreur lors de l'étape du chargement de la liste des rayons";
        next(error);
    }

});

// Pour récupérer les produits d'un rayon
app.get("/get_produits_rayon/:rayonId", (req, res, next) => {
    try {
        // Renvoit d'un tableau d'objets avec des produits correspondant à un 'rayonId'

        // === Version avec Mock ===
        /* const produitsDuRayon = mockData.produits.filter(p => p.rayon.id == req.params.rayonId);
        res.json(produitsDuRayon); */

        // === Version avec data dans mongoDB ===
        Product
            .find({rayon: req.params.rayonId}) // Bonne version !!
            //.find({"rayon": ObjectId(req.params.rayonId)}) // Mauvaise version
            .populate("rayon")
            .then(result => {
                res.json(result);
                //console.log(result); //TEST
            })
            .catch(err => console.log("Erreur dans récupération des rayons dans collection mongoDB"));
        
    } catch (error) {
        error.customMsg = "Erreur lors de l'étape de récupération des produits d'un rayon";
        next(error);
    }
});


app.get("/get_filters", (res, req, next) => {

});

app.use(erreur); // Middleware de gestion des erreurs

