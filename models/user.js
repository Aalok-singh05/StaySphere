const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // Simple require

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose); // Simple plugin call
module.exports = mongoose.model('User', userSchema);