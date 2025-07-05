const express = require('express');
const app = express();
const port = process.env.PORT || 3080;

const erreur = require('./app_modules/erreur');

const path = require('path');
console.log("Répertoire source : " + path.join(__dirname, "../App")); //TEST

// const config = require("./config/identifiants_mongoDB.js");
require('dotenv').config();
const mongoDBUsername = process.env.MONGODB_URL_CONNEXION_USERNAME;
const mongoDBPassword = process.env.MONGODB_URL_CONNEXION_PASSWORD;
const mongoDBDatabase = process.env.MONGODB_URL_CONNEXION_DB;
const mongoDBClusterName = process.env.MONGODB_URL_CONNEXION_CLUSTERNAME;
const mongoose = require('mongoose');


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
// const dbURI = `mongodb+srv://${config.username}:${config.password}@clustershopping.wzr6r8e.mongodb.net/${config.db}?retryWrites=true&w=majority&appName=${config.clustername}`;
const dbURI = `mongodb+srv://${mongoDBUsername}:${mongoDBPassword}@clustershopping.wzr6r8e.mongodb.net/${mongoDBDatabase}?retryWrites=true&w=majority&appName=${mongoDBClusterName}`;
// Connection à mongoDB avec la surcouche mangoose
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(port, () => {
            console.log("J'écoute au port " + port); //TEST
        })
    })
    .catch(err => {
        console.log("Erreur de connexion", err);
    });



const api = require("./routes/api");
app.use('/api', api);


// Quand site tourne en production
if(process.env.NODE_ENV === 'production') {
    // La partie Front faite avec Vue.js est buildée dans le rep. 'public' qui est déclaré comme static
    //app.use(express.static(__dirname + '/public/'));
    app.use(express.static(path.join(__dirname, "../App/public/")));

    // Pour ttes requetes 'get', affichage de la page 'index.html' du code Front buildé dans rep. 'public'
    // app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
    app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, "../App/public/index.html")))
}


app.use(erreur); // Middleware de gestion des erreurs

