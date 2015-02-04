var mongoose = require('mongoose');

// define the schema for our book model
var bookSchema = mongoose.Schema({

    title        : String,
    isbn         : String,
    author       : String,
    published    : Date,
    pages        : Number,
    nb_copy      : Number,
    resume       : String,
    genre        : String,
    users_id     : Array
    
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Book', bookSchema);
