const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nutriscoreSchema = require('./nutriscore').schema;
const labelQualiteSchema = require('./labelQualite').schema;

const productSchema = new Schema({
    intitule: {
        type: String,
        required: true
    },
    descriptif: String,
    marque: String,
    prix_unite: Number,
    unite: String,
    prix: {
        type: Number,
        required: true,
        min: 0,
        max: 10000
    },
    origine: String,
    nom_image: String,
    rayon: {
        type: Schema.Types.ObjectId, 
        ref: 'Department'
    },
    nutriscore: nutriscoreSchema,
    label_qualite: labelQualiteSchema,
    promotion: new Schema({
        pourcent: Boolean,
        info: String
    }),
}, { timestamps: true });

productSchema.virtual('imgPath').get(() => {
    return "../assets/imgs/" + this.nom_image + '.jpg';
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

