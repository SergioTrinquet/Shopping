const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labelQualiteSchema = new Schema({
    /* id: {
        type: String,
        required: true
    }, */
    lettre: {
        type: String,
        required: true
    }
});

const LabelQualite = mongoose.model('LabelQualite', labelQualiteSchema);

//module.exports = LabelQualite;
module.exports = {'model': LabelQualite, 'schema': labelQualiteSchema};