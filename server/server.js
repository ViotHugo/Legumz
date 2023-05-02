const express = require('express');
const app = express()
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

app.use(express.json({limit: '500mb'}))
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB Atlas réussie !');
  })
  .catch((error) => {
    console.log('Erreur de connexion à MongoDB Atlas :', error);
    throw error;
  });

app.post('/inscription', (req, res) => {
  const personneInscrire = req.body
  // Récupérer la collection Personne
  const Users = mongoose.connection.collection('Users');
  // Ajouter une personne à la collection
  Users.insertOne(personneInscrire)
    .then((result) => {
      console.log('User add :', result.insertedId);
      res.send(true);
    })
    .catch((err) => {
      console.log(err);
      mongoose.connection.close();    
    });
});

app.post('/recupProfile', (req,res) => {
  const emailUser = req.body.email
  const Users = mongoose.connection.collection('Users');

  // Récupérer tous les documents de la collection Personne
  Users.find({email : emailUser})
      .toArray()
      .then((resultats) => {
        res.send(resultats[0])
        })
        .catch((err) => {
          console.log(err)
  });
})

app.post('/emailsUtilises', (req,res) => {
  const Users = mongoose.connection.collection('Users');
  Users.find({}, { email: 1 })
  .toArray()
  .then((resultats) => {
    const emails = resultats.map((user) => user.email);
    res.send(emails)
  })
  .catch((err) => {
    console.log(err);
  });
})

app.post('/recupMatchPossible', async (req,res)  => {
  const emailUser = req.body.email
  const genderSearch = req.body.genderSearch
  const vegetableChoice = req.body.vegetableChoice
  const hobbies = req.body.hobbies;
  const Users = mongoose.connection.collection('Users');
  const NoMatch = mongoose.connection.collection('NoMatch');
  const Match = mongoose.connection.collection('Match');
  const emailsToExclude = [emailUser];

  try {
    const noMatchDocs = await NoMatch.find({ email1: emailUser }, { _id: 0, email2: 1 }).toArray();
    const matchDocs = await Match.find({ email1: emailUser }, { _id: 0, email2: 1 }).toArray();

    noMatchDocs.forEach((doc) => {
      emailsToExclude.push(doc.email2);
    });

    matchDocs.forEach((doc) => {
      emailsToExclude.push(doc.email2);
    });

    let resultats = await Users.find({ email: { $nin: emailsToExclude } }).toArray();

    //Enlever les profils dont le genre ne correspond pas
    if (genderSearch && genderSearch !== 'lesdeux') {
      resultats = resultats.filter((user) => user.gender == genderSearch );
    } 

    // Trie par légume
    if(vegetableChoice){
      resultats.sort((a, b) => {
        if(a.vegetableChoice == vegetableChoice && b.vegetableChoice != vegetableChoice){
          return -1
        }
        else if (a.vegetableChoice != vegetableChoice && b.vegetableChoice == vegetableChoice){
          return 1
        }
        else{
          return 0
        }
      })
    }
    if(hobbies){
      resultats.sort((a, b) => {
        if (a.vegetableChoice == b.vegetableChoice){
          const commonHobbiesA  = a.hobbies.filter((element) => hobbies.includes(element)).length;
          const commonHobbiesB  = b.hobbies.filter((element) => hobbies.includes(element)).length;
          if (commonHobbiesA > commonHobbiesB){
            return -1;
          }
          else if(commonHobbiesA < commonHobbiesB){
            return 1;
          }
          else{
            return 0;
          }
        }
      });
    }
    res.send(resultats);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
})

app.post('/connexion', (req, res) => {
  const paramConnexion = req.body
  const Users = mongoose.connection.collection('Users');

  // Récupérer tous les documents de la collection Personne
  Users.find({email : paramConnexion.email , password : paramConnexion.password})
      .toArray()
      .then((resultats) => {
          if(resultats.length===0){
            res.send(false)
          }else{
            res.send(true)
          }
        })
        .catch((err) => {
          console.log(err)
          res.send(false)
  });
});

app.get('/',(req,res) => {
  res.send("hello")
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
