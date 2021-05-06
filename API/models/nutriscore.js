const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nutriscoreSchema = new Schema({
    /* id: {
        type: String,
        required: true
    }, */
    lettre: {
        type: String,
        required: true
    }
});

const Nutriscore = mongoose.model('Nutriscore', nutriscoreSchema);

//module.exports = Nutriscore;
module.exports = {'model': Nutriscore, 'schema': nutriscoreSchema};