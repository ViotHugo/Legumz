const express = require('express');
const app = express()
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { inscription_dB } = require('./db/inscription');

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.post('/inscription', (req, res) => {
  const personneInscrire = req.body
  inscription_dB(personneInscrire)
});

app.post('/recupProfile', (req,res) => {
  const emailUser = req.body.email
  console.log(emailUser)
  mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB Atlas réussie !');

    // Récupérer la collection Personne
    const Users = mongoose.connection.collection('Users');

    // Récupérer tous les documents de la collection Personne
    Users.find({})
        .toArray()
        .then((resultats) => {
            mongoose.connection.close();
            console.log(resultats)
          })
          .catch((err) => {
            console.log(err)
            mongoose.connection.close();
            
    });

  })
  .catch((error) => {
    console.log('Erreur de connexion à MongoDB Atlas :', error);
    throw error;
  });
})
app.post('/connexion', (req, res) => {
  const paramConnexion = req.body
  mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB Atlas réussie !');

    // Récupérer la collection Personne
    const Users = mongoose.connection.collection('Users');

    // Récupérer tous les documents de la collection Personne
    Users.find({email : paramConnexion.email , password : paramConnexion.password})
        .toArray()
        .then((resultats) => {
            mongoose.connection.close();
            if(resultats.length===0){
              res.send(false)
            }else{
              res.send(true)
            }
          })
          .catch((err) => {
            console.log(err)
            mongoose.connection.close();
            res.send(false)
    });

  })
  .catch((error) => {
    console.log('Erreur de connexion à MongoDB Atlas :', error);
    throw error;
  });
});

app.get('/',(req,res) => {
  res.send("hello")

})
/*
const uri = 'mongodb+srv://root:root@cluster0.uwibc8n.mongodb.net/Test?retryWrites=true&w=majority';
// Remplacez "<password>" par votre mot de passe MongoDB Atlas
// Remplacez "<dbname>" par le nom de votre base de données
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB Atlas réussie !');

    // Récupérer la collection Personne
    const Personne = mongoose.connection.collection('Personne');

    // Ajouter une personne à la collection
    Personne.insertOne({ nom: 'Dupont', prenom: 'Jean', age: 30 })
      .then((result) => {
        console.log('Personne ajoutée :', result.insertedId);

        // Récupérer tous les documents de la collection Personne
        Personne.find({})
          .toArray()
          .then((resultats) => {
            console.log('Personnes :', resultats);
            mongoose.connection.close();
          })
          .catch((err) => {
            console.log(err);
            mongoose.connection.close();
          });
      })
      .catch((err) => {
        console.log(err);
        mongoose.connection.close();
      });
  })
  .catch((error) => {
    console.log('Erreur de connexion à MongoDB Atlas :', error);
  });
*/


