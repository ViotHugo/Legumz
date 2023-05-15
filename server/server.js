const express = require('express');
const app = express()
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const axios = require('axios');

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

app.post('/inscription', async (req, res) => {
    const personneInscrire = req.body;
    try {
      const coords = await apiGeocoding(personneInscrire.adress);
      personneInscrire.lon = coords.longitude;
      personneInscrire.lat = coords.latitude;
      console.log(personneInscrire)
      const Users = mongoose.connection.collection('Users');
      const result = await Users.insertOne(personneInscrire);
      console.log('User add :', result.insertedId);
      res.send(true);
    } catch (err) {
      console.log(err);
      mongoose.connection.close();
    }
});

app.post('/modifProfile', (req, res) => {
  const updateprofil = req.body
  delete updateprofil._id;
  // Récupérer la collection Personne
  
  const Users = mongoose.connection.collection('Users');
  // Ajouter une personne à la collection
  Users.updateOne({email:updateprofil.email},{$set:updateprofil})
    .then((result) => {
      console.log('User modif :');
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

app.post('/noMatch', (req,res) => {
  try {
    const NoMatch = mongoose.connection.collection('NoMatch');
    const userEmail = req.body.userEmail;
    const dataEmail = req.body.dataEmail;
    const result = NoMatch.insertOne({email1 : userEmail, email2 : dataEmail });
    console.log('NoMatch add :', result.insertedId);
    res.send(true);
  } catch (err) {
    console.log(err);
  }
})

app.post('/MatchVerif', async (req, res) => {
  try {
    const WaitMatch = mongoose.connection.collection('WaitMatch');
    const userEmail = req.body.userEmail;
    const dataEmail = req.body.dataEmail;
    const match = await WaitMatch.findOne({ email1: dataEmail, email2: userEmail });
    console.log(match);
    res.send(match !== null);
  } catch (err) {
    console.log(err);
  }
});

app.post('/recupMatchPossible', async (req,res)  => {
  const user = req.body.user; 
  const Users = mongoose.connection.collection('Users');
  const NoMatch = mongoose.connection.collection('NoMatch');
  const Match = mongoose.connection.collection('Match');
  const emailsToExclude = [user.email];

  try {
    const noMatchDocs = await NoMatch.find({ email1: user.email }, { _id: 0, email2: 1 }).toArray();
    const matchDocs = await Match.find({ email1: user.email }, { _id: 0, email2: 1 }).toArray();

    noMatchDocs.forEach((doc) => {
      emailsToExclude.push(doc.email2);
    });

    matchDocs.forEach((doc) => {
      emailsToExclude.push(doc.email2);
    });

    let resultats = await Users.find({ email: { $nin: emailsToExclude } }).toArray();
    //Enlever les profils dont le genre ne correspond pas
    if (user.genderSearch !== 'Les deux') {
      resultats = resultats.filter((match) => match.gender == user.genderSearch || match.gender == "Les deux");
    } 
    // Trie par légume
    if(user.vegetableSearch){
      resultats = resultats.filter((match) => user.vegetableSearch.includes(match.vegetableChoice));
    }
    // Trie par age
    if(user.vegetableSearch){
      resultats = resultats.filter((match) => user.minAge<=match.age && match.age<=user.maxAge);
    }
    
    //Trie par distance
    if (user.distanceMax) {
      resultats = await filterByDistance(user, resultats);
    }
   
    //par hobbies
    if(user.hobbies){
      resultats.sort((a, b) => {
          const commonHobbiesA  = a.hobbies.filter((element) => user.hobbies.includes(element)).length;
          const commonHobbiesB  = b.hobbies.filter((element) => user.hobbies.includes(element)).length;
          if (commonHobbiesA > commonHobbiesB){
            return -1;
          }
          else if(commonHobbiesA < commonHobbiesB){
            return 1;
          }
          else{
            return 0;
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


// Fonction qui filtre les résultats à une distance inférieure ou égale à MAX_DISTANCE_KM km de l'utilisateur
async function filterByDistance(user, resultats) {
  const MAX_DISTANCE_KM = user.distanceMax; // maximum distance en kilomètres

  // Filtre les résultats qui sont à une distance inférieure ou égale à MAX_DISTANCE_KM km de l'utilisateur
  const filteredResults = resultats.filter((resultat, index) => {
    const distance = getDistance({ latitude: user.lat, longitude: user.lon }, { latitude: resultat.lat, longitude: resultat.lon });
    return distance <= MAX_DISTANCE_KM;
  });

  return filteredResults;
}

// Fonction qui calcule la distance en kilomètres entre deux coordonnées géographiques
function getDistance(coords1, coords2) {
  const R = 6371; // rayon moyen de la Terre en km
  const dLat = deg2rad(coords2.latitude - coords1.latitude);
  const dLon = deg2rad(coords2.longitude - coords1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coords1.latitude)) *
      Math.cos(deg2rad(coords2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Fonction qui convertit une valeur en degrés en radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Fonction qui appelle l'API OpenCage Geocoder pour obtenir les coordonnées correspondantes à une adresse
async function apiGeocoding(address) {
  const API_KEY = "b0c41ab27bf748b0853e17f8df3faaeb"; // clé d'API OpenCage Geocoder
  const API_URL = `https://api.opencagedata.com/geocode/v1/json?key=${API_KEY}&q=${encodeURIComponent(
    address
  )}&limit=1&no_annotations=1`; // URL de l'API avec les paramètres nécessaires

  try {
    const response = await fetch(API_URL); // appel à l'API avec fetch() (qui retourne une Promise)
    const data = await response.json(); // extraction des données JSON de la réponse
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry; // récupération des coordonnées
      return { latitude: lat, longitude: lng }; // retourne un objet avec les coordonnées
    } else {
      throw new Error("L'adresse n'a pas été trouvée"); // lance une erreur si l'adresse n'a pas été trouvée
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erreur lors de l'appel à l'API de géocodage"); // lance une erreur en cas d'échec de l'appel à l'API
  }
}


