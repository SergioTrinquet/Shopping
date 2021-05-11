const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labelQualiteSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    }
});

const LabelQualite = mongoose.model('LabelQualite', labelQualiteSchema);

module.exports = {
    'model': LabelQualite, 
    'schema': labelQualiteSchema
};