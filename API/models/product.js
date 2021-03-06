const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nutriscoreSchema = require('./nutriscore').schema;
const labelQualiteSchema = require('./labelQualite').schema;

const productSchema = new Schema({
    intitule: {
        type: String,
        required: true
    },
    descriptif: {
        type: String,
        required: true
    },
    marque: String,
    prix_unite: {
        type: Number,
        required: true
    },
    unite: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true,
        min: 0,
        max: 10000
    },
    origine: {
        type: String,
        uppercase: true
    },
    nom_image: String,
    rayon: {
        type: Schema.Types.ObjectId, 
        ref: 'Department',
        required: true
    },
    nutriscore: nutriscoreSchema,
    label_qualite: [labelQualiteSchema],
    promotion: new Schema({
        pourcent: Number,
        reduction: new Schema({ qte: Number, somme: Number })
    }),
}, { timestamps: true });

/* productSchema.virtual('imgPath').get(() => {
    return "@/assets/imgs/produits/" + this.nom_image + '.jpg';
}) */

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

