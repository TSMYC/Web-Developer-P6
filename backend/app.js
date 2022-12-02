//Import des packages
const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const path = require('path');

//Import des routes
const sauceRoutes = require('./routes/sauceRoute');
const userRoutes = require('./routes/userRoute');

//mongoose
mongoose.connect('mongodb+srv://TESUSER:6X6ocq9KsOPAhp1z@cluster1.xqbee6c.mongodb.net/piquante')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log(error));

const app = express();

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
