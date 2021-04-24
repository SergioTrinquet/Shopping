const express = require('express');
const app = express();
const port = process.env.PORT || 3080;

const mockData = require('./mockData/mock'); // Variables mock juste pour phase de dev.

const erreur = require('./app_modules/erreur');


// on précise ici qu'on autorise toutes les sources
// puis dans le second header, quels headers http sont acceptés
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Pour alimenter marge rayons
app.get("/get_rayons", (req, res, next) => {
    try {
        res.json(mockData.rayons);
    } catch (error) {
        error.customMsg = "Erreur lors de l'étape du chargement de la liste des rayons";
        next(error);
    }

});

// Pour récupérer les produits d'un rayon
app.get("/get_produits_rayon/:rayonId", (req, res, next) => {
    try {
        // ICI renvoyer un tableau d'objets avec des produits correspondant à un 'rayonId'
        const produitsDuRayon = mockData.produits.filter(p => p.rayon.id == req.params.rayonId);
        console.log(produitsDuRayon); //TEST
        res.json(produitsDuRayon); //TEST
        
        //const nomRayon = produitsDuRayon(0).rayon.intitule;
        //res.json({ produitsDuRayon: produitsDuRayon, nomRayon: nomRayon }); //TEST
    } catch (error) {
        error.customMsg = "Erreur lors de l'étape de récupération des produits d'un rayon";
        next(error);
    }
});

app.use(erreur); // Middleware de gestion des erreurs

app.listen(port, () => {
    console.log("J'écoute au port " + port); //TEST
})