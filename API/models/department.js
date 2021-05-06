const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
/*     id: {
        type: String,
        required: true
    }, */
    intitule: {
        type: String,
        required: true
    }
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;