const mongoose = require('mongoose');

//Sécurité de la connexion des utilisateurs
const uniqueValidator = require('mongoose-unique-validator');

//Schéma type des données de l'utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);