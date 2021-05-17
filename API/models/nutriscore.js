const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// NOTE: Si pas de '_id' dans le schema, création d'une prop. '_id' automatique dans mongoDB quand même, de type ObjectId
// NOTE suite : Qd prop '_id' dans schema, le créé selon le Type stipulé dedans, donc si Type 'String' par ex., forcera le type par défaut ObjectId
const nutriscoreSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    lettre: {
        type: String,
        required: true
    }
});

const Nutriscore = mongoose.model('Nutriscore', nutriscoreSchema);

module.exports = {
    'model': Nutriscore, 
    'schema': nutriscoreSchema
};