const mongoose = require('mongoose');


const  StudentSchema = mongoose.Schema({
    name : String,
    phone : String,
    email : String,
    password : String,
    fees : String
});


var Student = module.exports = mongoose.model('Student',StudentSchema);